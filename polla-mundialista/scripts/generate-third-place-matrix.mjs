import { readFile, writeFile } from 'node:fs/promises'

const sourcePath = process.argv[2]
const outputPath = new URL(
  '../src/features/bracket/third-place-matrix.ts',
  import.meta.url,
)

if (!sourcePath) {
  throw new Error('Provide the downloaded knockout-stage HTML path.')
}

const html = await readFile(sourcePath, 'utf8')
const heading = '<h3 id="Combinations_of_matches_in_the_round_of_32"'
const section = html.slice(html.indexOf(heading))
const table = section.slice(
  section.indexOf('<table'),
  section.indexOf('</table>') + '</table>'.length,
)
const rows = [...table.matchAll(/<tr>([\s\S]*?)<\/tr>/g)]
  .map((match) => match[1])
  .map((row) => {
    const number = Number(
      (row.match(/<th[^>]*scope="row"[^>]*>([\s\S]*?)<\/th>/)?.[1] ?? '')
        .replace(/<[^>]+>/g, '')
        .trim(),
    )
    const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(
      (cell) => cell[1].replace(/<[^>]+>/g, '').trim(),
    )

    return { number, cells }
  })
  .filter(({ number, cells }) => number > 0 && cells.length === 20)

if (rows.length !== 495) {
  throw new Error(`Expected 495 combinations, found ${rows.length}.`)
}

const matrix = Object.fromEntries(
  rows.map(({ cells }) => {
    const qualifiedGroups = cells
      .slice(0, 12)
      .filter(Boolean)
      .sort()
      .join('')
    const opponents = cells.slice(12).map((value) => value.replace('3', ''))
    return [qualifiedGroups, opponents]
  }),
)

const file = `// Generated from FIFA's 2026 tournament regulations matrix.\n` +
  `// Key: eight qualified third-place groups. Value order: 1A, 1B, 1D, 1E, 1G, 1I, 1K, 1L.\n` +
  `export const thirdPlaceMatrix: Record<string, string[]> = ${JSON.stringify(matrix, null, 2)}\n`

await writeFile(outputPath, file)
