import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const flagsDir = join(rootDir, 'public', 'flags')
const dataDir = join(rootDir, 'src', 'data')
const migrationsDir = join(rootDir, 'supabase', 'migrations')

const teams = [
  ['MEX', 'México', 'A', 'mx', 15],
  ['RSA', 'Sudáfrica', 'A', 'za', 61],
  ['KOR', 'Corea del Sur', 'A', 'kr', 22],
  ['CZE', 'Chequia', 'A', 'cz', 44],
  ['CAN', 'Canadá', 'B', 'ca', 27],
  ['SUI', 'Suiza', 'B', 'ch', 17],
  ['QAT', 'Catar', 'B', 'qa', 51],
  ['BIH', 'Bosnia y Herzegovina', 'B', 'ba', 68],
  ['BRA', 'Brasil', 'C', 'br', 5],
  ['MAR', 'Marruecos', 'C', 'ma', 11],
  ['HAI', 'Haití', 'C', 'ht', 84],
  ['SCO', 'Escocia', 'C', 'gb-sct', 38],
  ['USA', 'Estados Unidos', 'D', 'us', 14],
  ['PAR', 'Paraguay', 'D', 'py', 39],
  ['AUS', 'Australia', 'D', 'au', 26],
  ['TUR', 'Turquía', 'D', 'tr', 25],
  ['GER', 'Alemania', 'E', 'de', 10],
  ['CUW', 'Curazao', 'E', 'cw', 82],
  ['CIV', 'Costa de Marfil', 'E', 'ci', 42],
  ['ECU', 'Ecuador', 'E', 'ec', 23],
  ['NED', 'Países Bajos', 'F', 'nl', 7],
  ['JPN', 'Japón', 'F', 'jp', 18],
  ['SWE', 'Suecia', 'F', 'se', 34],
  ['TUN', 'Túnez', 'F', 'tn', 50],
  ['BEL', 'Bélgica', 'G', 'be', 8],
  ['EGY', 'Egipto', 'G', 'eg', 35],
  ['IRN', 'Irán', 'G', 'ir', 20],
  ['NZL', 'Nueva Zelanda', 'G', 'nz', 86],
  ['ESP', 'España', 'H', 'es', 1],
  ['CPV', 'Cabo Verde', 'H', 'cv', 72],
  ['KSA', 'Arabia Saudita', 'H', 'sa', 60],
  ['URU', 'Uruguay', 'H', 'uy', 16],
  ['FRA', 'Francia', 'I', 'fr', 3],
  ['SEN', 'Senegal', 'I', 'sn', 19],
  ['IRQ', 'Irak', 'I', 'iq', 58],
  ['NOR', 'Noruega', 'I', 'no', 29],
  ['ARG', 'Argentina', 'J', 'ar', 2],
  ['ALG', 'Argelia', 'J', 'dz', 36],
  ['AUT', 'Austria', 'J', 'at', 24],
  ['JOR', 'Jordania', 'J', 'jo', 66],
  ['POR', 'Portugal', 'K', 'pt', 6],
  ['COD', 'RD del Congo', 'K', 'cd', 82],
  ['UZB', 'Uzbekistán', 'K', 'uz', 50],
  ['COL', 'Colombia', 'K', 'co', 13],
  ['ENG', 'Inglaterra', 'L', 'gb-eng', 4],
  ['CRO', 'Croacia', 'L', 'hr', 9],
  ['GHA', 'Ghana', 'L', 'gh', 72],
  ['PAN', 'Panamá', 'L', 'pa', 30],
].map(([fifaCode, name, groupName, flagCode, fifaRank]) => ({
  fifaCode,
  name,
  groupName,
  flagCode,
  fifaRank,
  flagUrl: `/flags/${fifaCode.toLowerCase()}.svg`,
}))

const teamByCode = new Map(teams.map((team) => [team.fifaCode, team]))

function decodeEntities(value) {
  return value
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&#32;', ' ')
    .replaceAll('−', '-')
    .replaceAll('–', '-')
}

function extractField(block, field) {
  const match = block.match(new RegExp(`\\|${field}\\s*=([^\\n\\r]*)`))
  return match?.[1]?.trim() ?? ''
}

function parseDate(block) {
  const value = extractField(block, 'date')
  const match = value.match(/\{\{Start date\|(\d{4})\|(\d{1,2})\|(\d{1,2})/)

  if (!match) throw new Error(`Fecha no reconocida: ${value}`)

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  }
}

function parseTime(block) {
  const value = decodeEntities(extractField(block, 'time'))
  const timeMatch = value.match(/(\d{1,2})(?::(\d{2}))?\s*([ap])\.?m\.?/i)
  const offsetMatch = value.match(/UTC\s*([+-])\s*(\d{1,2})/)

  if (!timeMatch || !offsetMatch) {
    throw new Error(`Hora no reconocida: ${value}`)
  }

  let hour = Number(timeMatch[1])
  const minute = Number(timeMatch[2] ?? 0)
  const meridiem = timeMatch[3].toLowerCase()

  if (meridiem === 'p' && hour !== 12) hour += 12
  if (meridiem === 'a' && hour === 12) hour = 0

  const offsetHours =
    Number(offsetMatch[2]) * (offsetMatch[1] === '-' ? -1 : 1)

  return { hour, minute, offsetHours }
}

function toUtcIso(date, time) {
  const utcMilliseconds =
    Date.UTC(date.year, date.month - 1, date.day, time.hour, time.minute) -
    time.offsetHours * 60 * 60 * 1000

  return new Date(utcMilliseconds).toISOString()
}

function parseTeamCode(block, field) {
  const value = extractField(block, field)
  const match = value.match(/\|([A-Z]{3})\}\}/)

  if (!match) throw new Error(`Equipo no reconocido: ${value}`)
  if (!teamByCode.has(match[1])) {
    throw new Error(`Código FIFA no configurado: ${match[1]}`)
  }

  return match[1]
}

function parseScore(block) {
  const value = decodeEntities(extractField(block, 'score'))
  const score = value.match(/(?:\||^)(\d+)-(\d+)(?:\}\}|$)/)

  return score
    ? { homeScore: Number(score[1]), awayScore: Number(score[2]) }
    : { homeScore: null, awayScore: null }
}

const completedMatchNumbers = {
  A1: 1,
  A2: 2,
  B1: 3,
}

function parseMatchNumber(block, section) {
  const reportMatch = block.match(/Match\s+(\d+)/i)
  const matchNumber = reportMatch?.[1] ?? completedMatchNumbers[section]

  if (!matchNumber) {
    throw new Error(`Número de partido no encontrado en ${section}`)
  }

  return Number(matchNumber)
}

async function fetchGroup(groupName) {
  const url = `https://en.wikipedia.org/w/index.php?title=2026_FIFA_World_Cup_Group_${groupName}&action=raw`
  let response

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    response = await fetch(url, {
      headers: {
        'User-Agent':
          'PollaMundialista-uPlannerLabs/1.0 (fixture seed generator)',
      },
    })

    if (response.ok) break
    await new Promise((resolve) => setTimeout(resolve, attempt * 1000))
  }

  if (!response?.ok) {
    throw new Error(
      `No se pudo descargar el grupo ${groupName}: ${response?.status}`,
    )
  }

  const content = await response.text()
  const matches = []
  const sectionStarts = [...content.matchAll(/<section begin="?([A-L]\d)"?\s*\/>/g)]
  const sectionPositions = new Map(
    sectionStarts.map((match) => [match[1], match.index]),
  )

  for (const team of teams.filter((item) => item.groupName === groupName)) {
    const rankingRow = content
      .split(/\r?\n/)
      .find(
        (line) =>
          line.startsWith(`| ${groupName}`) &&
          line.includes(`|fb|${team.fifaCode}}}`),
      )
    const juneRanking = Number(rankingRow?.split('||').at(-1)?.trim())

    if (!Number.isInteger(juneRanking)) {
      throw new Error(`Ranking FIFA no encontrado para ${team.fifaCode}`)
    }

    team.fifaRank = juneRanking
  }

  for (let index = 1; index <= 6; index += 1) {
    const section = `${groupName}${index}`
    const start = sectionPositions.get(section)
    const nextStart = sectionPositions.get(`${groupName}${index + 1}`)
    const block =
      start === undefined
        ? undefined
        : content.slice(start, nextStart ?? content.length)

    if (!block) throw new Error(`No se encontró la sección ${section}`)

    const date = parseDate(block)
    const time = parseTime(block)
    const score = parseScore(block)

    matches.push({
      matchNumber: parseMatchNumber(block, section),
      phase: 'group_stage',
      groupName,
      homeTeamCode: parseTeamCode(block, 'team1'),
      awayTeamCode: parseTeamCode(block, 'team2'),
      matchDate: toUtcIso(date, time),
      status: score.homeScore === null ? 'scheduled' : 'finished',
      ...score,
    })
  }

  return matches
}

function quoteSql(value) {
  return `'${String(value).replaceAll("'", "''")}'`
}

function generateSql(matches) {
  const teamValues = teams
    .map(
      (team) =>
        `  (${quoteSql(team.fifaCode)}, ${quoteSql(team.name)}, ${quoteSql(team.groupName)}, ${quoteSql(team.flagUrl)}, ${team.fifaRank})`,
    )
    .join(',\n')
  const matchValues = matches
    .map(
      (match) =>
        `  (${match.matchNumber}, ${quoteSql(match.phase)}, ${quoteSql(match.groupName)}, ${quoteSql(match.homeTeamCode)}, ${quoteSql(match.awayTeamCode)}, ${quoteSql(match.matchDate)}::timestamptz, ${match.homeScore ?? 'null'}, ${match.awayScore ?? 'null'}, ${quoteSql(match.status)})`,
    )
    .join(',\n')

  return `-- Generated by scripts/generate-world-cup-seed.mjs.
-- Sources: FIFA match-centre links embedded in the 2026 World Cup group pages.

alter table public.teams
  add column if not exists fifa_code text,
  add column if not exists fifa_rank integer;

alter table public.matches
  add column if not exists match_number integer;

create unique index if not exists teams_fifa_code_key
  on public.teams (fifa_code);

create unique index if not exists matches_match_number_key
  on public.matches (match_number);

insert into public.teams (fifa_code, name, group_name, flag_url, fifa_rank)
values
${teamValues}
on conflict (fifa_code) do update
set
  name = excluded.name,
  group_name = excluded.group_name,
  flag_url = excluded.flag_url,
  fifa_rank = excluded.fifa_rank;

with fixture_data (
  match_number,
  phase,
  group_name,
  home_team_code,
  away_team_code,
  match_date,
  home_score,
  away_score,
  status
) as (
  values
${matchValues}
)
insert into public.matches (
  match_number,
  phase,
  group_name,
  home_team_id,
  away_team_id,
  match_date,
  home_score,
  away_score,
  winner_team_id,
  status
)
select
  fixture_data.match_number,
  fixture_data.phase::public.match_phase,
  fixture_data.group_name,
  home_team.id,
  away_team.id,
  fixture_data.match_date,
  fixture_data.home_score,
  fixture_data.away_score,
  case
    when fixture_data.home_score > fixture_data.away_score then home_team.id
    when fixture_data.away_score > fixture_data.home_score then away_team.id
    else null
  end,
  fixture_data.status::public.match_status
from fixture_data
join public.teams home_team
  on home_team.fifa_code = fixture_data.home_team_code
join public.teams away_team
  on away_team.fifa_code = fixture_data.away_team_code
on conflict (match_number) do update
set
  phase = excluded.phase,
  group_name = excluded.group_name,
  home_team_id = excluded.home_team_id,
  away_team_id = excluded.away_team_id,
  match_date = excluded.match_date,
  home_score = excluded.home_score,
  away_score = excluded.away_score,
  winner_team_id = excluded.winner_team_id,
  status = excluded.status;
`
}

async function downloadFlags() {
  await mkdir(flagsDir, { recursive: true })

  await Promise.all(
    teams.map(async (team) => {
      const response = await fetch(
        `https://flagcdn.com/${team.flagCode.toLowerCase()}.svg`,
      )

      if (!response.ok) {
        throw new Error(`No se pudo descargar la bandera de ${team.name}`)
      }

      await writeFile(
        join(flagsDir, `${team.fifaCode.toLowerCase()}.svg`),
        await response.text(),
        'utf8',
      )
    }),
  )
}

async function main() {
  const groupNames = 'ABCDEFGHIJKL'.split('')
  const groupMatches = []

  for (const groupName of groupNames) {
    groupMatches.push(await fetchGroup(groupName))
    await new Promise((resolve) => setTimeout(resolve, 300))
  }

  const matches = groupMatches
    .flat()
    .sort((first, second) => first.matchNumber - second.matchNumber)

  if (matches.length !== 72) {
    throw new Error(`Se esperaban 72 partidos y se obtuvieron ${matches.length}`)
  }

  await Promise.all([
    mkdir(dataDir, { recursive: true }),
    mkdir(migrationsDir, { recursive: true }),
    downloadFlags(),
  ])

  await Promise.all([
    writeFile(
      join(dataDir, 'world-cup-2026.json'),
      `${JSON.stringify({ teams, matches }, null, 2)}\n`,
      'utf8',
    ),
    writeFile(
      join(migrationsDir, '202606120004_seed_world_cup_group_stage.sql'),
      generateSql(matches),
      'utf8',
    ),
  ])

  const finished = matches.filter((match) => match.status === 'finished')
  console.log(
    JSON.stringify({
      teams: teams.length,
      matches: matches.length,
      finished: finished.map((match) => ({
        matchNumber: match.matchNumber,
        score: `${match.homeScore}-${match.awayScore}`,
      })),
    }),
  )
}

await main()
