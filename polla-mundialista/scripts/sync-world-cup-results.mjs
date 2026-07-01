const sourceUrl = 'https://en.wikipedia.org/wiki/2026_FIFA_World_Cup'

const teamAliases = new Map(
  Object.entries({
    Mexico: 'MEX',
    'South Africa': 'RSA',
    'South Korea': 'KOR',
    'Czech Republic': 'CZE',
    Canada: 'CAN',
    Switzerland: 'SUI',
    Qatar: 'QAT',
    'Bosnia and Herzegovina': 'BIH',
    Brazil: 'BRA',
    Morocco: 'MAR',
    Haiti: 'HAI',
    Scotland: 'SCO',
    'United States': 'USA',
    Paraguay: 'PAR',
    Australia: 'AUS',
    Turkey: 'TUR',
    Germany: 'GER',
    Curacao: 'CUW',
    Curaçao: 'CUW',
    'Ivory Coast': 'CIV',
    Ecuador: 'ECU',
    Netherlands: 'NED',
    Japan: 'JPN',
    Sweden: 'SWE',
    Tunisia: 'TUN',
    Belgium: 'BEL',
    Egypt: 'EGY',
    Iran: 'IRN',
    'New Zealand': 'NZL',
    Spain: 'ESP',
    'Cape Verde': 'CPV',
    'Saudi Arabia': 'KSA',
    Uruguay: 'URU',
    France: 'FRA',
    Senegal: 'SEN',
    Iraq: 'IRQ',
    Norway: 'NOR',
    Argentina: 'ARG',
    Algeria: 'ALG',
    Austria: 'AUT',
    Jordan: 'JOR',
    Portugal: 'POR',
    'DR Congo': 'COD',
    Uzbekistan: 'UZB',
    Colombia: 'COL',
    England: 'ENG',
    Croatia: 'CRO',
    Ghana: 'GHA',
    Panama: 'PAN',
  }),
)

function decodeHtml(value) {
  return value
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replaceAll('&#160;', ' ')
    .replaceAll('&#32;', ' ')
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&ndash;', '-')
    .replaceAll('&mdash;', '-')
    .replaceAll('&#8211;', '-')
    .replaceAll('&#8212;', '-')
    .replaceAll('&amp;', '&')
    .replace(/[\u2010-\u2015\u2212]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function parseKickoff(block) {
  const date = block.match(/itvstart">(\d{4}-\d{2}-\d{2})</)?.[1]
  const timeText = decodeHtml(
    block.match(/<div class="ftime">([\s\S]*?)<\/div>/)?.[1] ?? '',
  )
  const time = timeText.match(/(\d{1,2}):(\d{2})\s*([ap])\.m\./i)
  const offset = timeText.match(/UTC\D?(\d{1,2})/)
  if (!date || !time || !offset) return null

  let hour = Number(time[1])
  if (time[3].toLowerCase() === 'p' && hour !== 12) hour += 12
  if (time[3].toLowerCase() === 'a' && hour === 12) hour = 0

  return new Date(
    Date.UTC(
      Number(date.slice(0, 4)),
      Number(date.slice(5, 7)) - 1,
      Number(date.slice(8, 10)),
      hour + Number(offset[1]),
      Number(time[2]),
    ),
  ).toISOString()
}

function parseTeam(block, side) {
  const className = side === 'home' ? 'fhome' : 'faway'
  const content = block.match(
    new RegExp(
      `<th[^>]*class="[^"]*\\b${className}\\b[^"]*"[\\s\\S]*?<span itemprop="name">([\\s\\S]*?)<\\/span><\\/th>`,
    ),
  )?.[1]
  const name = content ? decodeHtml(content) : ''
  return teamAliases.get(name) ?? null
}

function parseMatchNumber(block, scoreText) {
  return (
    Number(scoreText.match(/Match\s+(\d+)/i)?.[1]) ||
    Number(decodeHtml(block).match(/Match\s+(\d+)/i)?.[1]) ||
    null
  )
}

function parsePenaltyShootout(block, scoreText, homeTeamCode, awayTeamCode) {
  const scorePenaltyText =
    scoreText.match(/\((\d+)\s*-\s*(\d+)\s*p(?:en)?\.?\)/i) ??
    decodeHtml(block).match(/\((\d+)\s*-\s*(\d+)\s*p(?:en)?\.?\)/i)

  if (scorePenaltyText) {
    return {
      homePenalties: Number(scorePenaltyText[1]),
      awayPenalties: Number(scorePenaltyText[2]),
    }
  }

  const blockText = decodeHtml(block)
  for (const [teamName, teamCode] of teamAliases) {
    const penaltyText = blockText.match(
      new RegExp(
        `${escapeRegExp(teamName)}\\s+(?:won|wins|win)\\s+(\\d+)\\s*-\\s*(\\d+)\\s+(?:on|after)\\s+penalt`,
        'i',
      ),
    )

    if (!penaltyText) continue

    if (teamCode === homeTeamCode) {
      return {
        homePenalties: Number(penaltyText[1]),
        awayPenalties: Number(penaltyText[2]),
      }
    }

    if (teamCode === awayTeamCode) {
      return {
        homePenalties: Number(penaltyText[2]),
        awayPenalties: Number(penaltyText[1]),
      }
    }
  }

  return {
    homePenalties: null,
    awayPenalties: null,
  }
}

export function parseWorldCupPage(html) {
  return html
    .split(/class="footballbox"/)
    .slice(1)
    .map((block) => {
      const scoreText = decodeHtml(
        block.match(/<th[^>]*class="[^"]*\bfscore\b[^"]*"[^>]*>([\s\S]*?)<\/th>/)?.[1] ?? '',
      )
      const homeTeamCode = parseTeam(block, 'home')
      const awayTeamCode = parseTeam(block, 'away')
      const matchNumber = parseMatchNumber(block, scoreText)
      const score = scoreText.match(/(\d+)\s*-\s*(\d+)/)
      const penalties = parsePenaltyShootout(
        block,
        scoreText,
        homeTeamCode,
        awayTeamCode,
      )

      return {
        matchNumber,
        matchDate: parseKickoff(block),
        homeTeamCode,
        awayTeamCode,
        homeScore: score ? Number(score[1]) : null,
        awayScore: score ? Number(score[2]) : null,
        homePenalties: penalties.homePenalties,
        awayPenalties: penalties.awayPenalties,
      }
    })
    .filter(
      (match) =>
        match.matchDate &&
        Number.isInteger(match.matchNumber) &&
        match.matchNumber >= 1 &&
        match.matchNumber <= 104,
    )
}

async function supabaseRequest(path, options = {}) {
  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.')
  }

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
      ...options.headers,
    },
  })
  if (!response.ok) throw new Error(`${response.status}: ${await response.text()}`)
}

export async function syncResults() {
  const response = await fetch(sourceUrl, {
    headers: {
      'User-Agent': 'PollaMundialista-uPlannerLabs/1.0 (result synchronizer)',
    },
  })
  if (!response.ok) throw new Error(`Source returned ${response.status}.`)

  const matches = parseWorldCupPage(await response.text())
  const finished = matches.filter(
    (match) => match.homeScore !== null && match.awayScore !== null,
  )

  for (const match of matches) {
    const winnerCode =
      match.homeScore > match.awayScore
        ? match.homeTeamCode
        : match.awayScore > match.homeScore
          ? match.awayTeamCode
          : match.homePenalties > match.awayPenalties
            ? match.homeTeamCode
            : match.awayPenalties > match.homePenalties
              ? match.awayTeamCode
              : null

    await supabaseRequest('rpc/sync_world_cup_match_result', {
      method: 'POST',
      body: JSON.stringify({
        p_match_number: match.matchNumber,
        p_match_date: match.matchDate,
        p_home_team_code: match.homeTeamCode,
        p_away_team_code: match.awayTeamCode,
        p_home_score: match.homeScore,
        p_away_score: match.awayScore,
        p_home_penalty_score: match.homePenalties,
        p_away_penalty_score: match.awayPenalties,
        p_winner_team_code: winnerCode,
        p_status:
          match.homeScore === null || match.awayScore === null
            ? 'scheduled'
            : 'finished',
      }),
    })
  }

  return { parsed: matches.length, finished: finished.length }
}

if (process.argv[1]?.endsWith('sync-world-cup-results.mjs')) {
  syncResults().then((result) => console.log(JSON.stringify(result)))
}
