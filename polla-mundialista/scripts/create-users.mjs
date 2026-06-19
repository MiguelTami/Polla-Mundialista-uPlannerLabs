import { readFile } from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { users } from './users-to-create.mjs'

const shouldExecute = process.argv.includes('--execute')
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function loadLocalEnv() {
  try {
    const content = await readFile(new URL('../.env', import.meta.url), 'utf8')

    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^([^#=\s]+)=(.*)$/)
      if (!match || process.env[match[1]]) continue
      process.env[match[1]] = match[2].trim()
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }
}

function validateUsers(entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error(
      'Agrega al menos un usuario en scripts/users-to-create.mjs.',
    )
  }

  const errors = []
  const seenEmails = new Set()

  entries.forEach((user, index) => {
    const label = `Usuario ${index + 1}`
    const email = user.email?.trim().toLowerCase()
    const displayName = user.displayName?.trim()

    if (!emailPattern.test(email ?? '')) {
      errors.push(`${label}: correo inválido.`)
    } else if (seenEmails.has(email)) {
      errors.push(`${label}: correo duplicado en el archivo.`)
    } else {
      seenEmails.add(email)
    }

    if (!displayName || displayName.length < 2 || displayName.length > 80) {
      errors.push(`${label}: el nombre debe tener entre 2 y 80 caracteres.`)
    }

    if (typeof user.password !== 'string' || user.password.length < 8) {
      errors.push(`${label}: la contraseña debe tener al menos 8 caracteres.`)
    }
  })

  if (errors.length > 0) {
    throw new Error(`Corrige estos datos:\n- ${errors.join('\n- ')}`)
  }

  return entries.map((user) => ({
    email: user.email.trim().toLowerCase(),
    password: user.password,
    displayName: user.displayName.trim(),
  }))
}

async function getExistingEmails(supabase) {
  const emails = new Set()
  let page = 1

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    })

    if (error) throw error

    for (const user of data.users) {
      if (user.email) emails.add(user.email.toLowerCase())
    }

    if (data.users.length < 1000) break
    page += 1
  }

  return emails
}

await loadLocalEnv()

const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const validatedUsers = validateUsers(users)

if (!shouldExecute) {
  console.log(
    `Validación correcta: ${validatedUsers.length} usuario(s). ` +
      'No se creó ninguna cuenta.',
  )
  console.log('Ejecuta "npm run users:create" para crear las cuentas.')
  process.exit(0)
}

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Configura SUPABASE_SERVICE_ROLE_KEY en .env. ' +
      'La URL puede venir de SUPABASE_URL o VITE_SUPABASE_URL.',
  )
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
const existingEmails = await getExistingEmails(supabase)
const results = {
  created: [],
  skipped: [],
  failed: [],
}

for (const user of validatedUsers) {
  if (existingEmails.has(user.email)) {
    results.skipped.push(user.email)
    continue
  }

  const { error } = await supabase.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true,
    user_metadata: {
      display_name: user.displayName,
    },
  })

  if (error) {
    results.failed.push({ email: user.email, message: error.message })
  } else {
    results.created.push(user.email)
    existingEmails.add(user.email)
  }
}

console.log(`Creados: ${results.created.length}`)
console.log(`Omitidos porque ya existían: ${results.skipped.length}`)
console.log(`Fallidos: ${results.failed.length}`)

for (const failure of results.failed) {
  console.error(`- ${failure.email}: ${failure.message}`)
}

if (results.failed.length > 0) process.exitCode = 1
