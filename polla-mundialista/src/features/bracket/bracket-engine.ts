import type { Match, Team } from '../matches/matches.types'
import type { Prediction } from '../predictions/predictions.types'
import type {
  BracketEntrant,
  BracketMatch,
  GroupStanding,
  KnockoutPrediction,
  SimulatedGroup,
} from './bracket.types'
import { thirdPlaceMatrix } from './third-place-matrix'

const groups = 'ABCDEFGHIJKL'.split('')
const thirdSlotWinners = ['A', 'B', 'D', 'E', 'G', 'I', 'K', 'L']
const thirdCandidates: Record<number, string[]> = {
  74: ['A', 'B', 'C', 'D', 'F'],
  77: ['C', 'D', 'F', 'G', 'H'],
  79: ['C', 'E', 'F', 'H', 'I'],
  80: ['E', 'H', 'I', 'J', 'K'],
  81: ['B', 'E', 'F', 'I', 'J'],
  82: ['A', 'E', 'H', 'I', 'J'],
  85: ['E', 'F', 'G', 'I', 'J'],
  87: ['D', 'E', 'I', 'J', 'L'],
}

type GroupPosition = { group: string; position: 1 | 2 | 3 }
type RoundOf32Source = GroupPosition | { thirdForWinner: string }

const roundOf32: Array<[number, RoundOf32Source, RoundOf32Source]> = [
  [73, { group: 'A', position: 2 }, { group: 'B', position: 2 }],
  [74, { group: 'E', position: 1 }, { thirdForWinner: 'E' }],
  [75, { group: 'F', position: 1 }, { group: 'C', position: 2 }],
  [76, { group: 'C', position: 1 }, { group: 'F', position: 2 }],
  [77, { group: 'I', position: 1 }, { thirdForWinner: 'I' }],
  [78, { group: 'E', position: 2 }, { group: 'I', position: 2 }],
  [79, { group: 'A', position: 1 }, { thirdForWinner: 'A' }],
  [80, { group: 'L', position: 1 }, { thirdForWinner: 'L' }],
  [81, { group: 'D', position: 1 }, { thirdForWinner: 'D' }],
  [82, { group: 'G', position: 1 }, { thirdForWinner: 'G' }],
  [83, { group: 'K', position: 2 }, { group: 'L', position: 2 }],
  [84, { group: 'H', position: 1 }, { group: 'J', position: 2 }],
  [85, { group: 'B', position: 1 }, { thirdForWinner: 'B' }],
  [86, { group: 'J', position: 1 }, { group: 'H', position: 2 }],
  [87, { group: 'K', position: 1 }, { thirdForWinner: 'K' }],
  [88, { group: 'D', position: 2 }, { group: 'G', position: 2 }],
]

const laterRounds = [
  { round: 'round_of_16' as const, matches: [[89, 73, 75], [90, 74, 77], [91, 76, 78], [92, 79, 80], [93, 83, 84], [94, 81, 82], [95, 86, 88], [96, 85, 87]] },
  { round: 'quarter_final' as const, matches: [[97, 89, 90], [98, 93, 94], [99, 91, 92], [100, 95, 96]] },
  { round: 'semi_final' as const, matches: [[101, 97, 98], [102, 99, 100]] },
  { round: 'final' as const, matches: [[104, 101, 102]] },
]

function emptyStanding(team: Team): GroupStanding {
  return {
    team,
    played: 0,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
  }
}

function compareStandings(first: GroupStanding, second: GroupStanding) {
  return (
    second.points - first.points ||
    second.goalDifference - first.goalDifference ||
    second.goalsFor - first.goalsFor ||
    (first.team.fifaRank ?? 999) - (second.team.fifaRank ?? 999) ||
    first.team.name.localeCompare(second.team.name)
  )
}

export function simulateGroups(
  matches: Match[],
  predictions: Prediction[],
): SimulatedGroup[] {
  const predictionsByMatch = new Map(
    predictions.map((prediction) => [String(prediction.matchId), prediction]),
  )

  return groups.map((groupName) => {
    const groupMatches = matches.filter(
      (match) => match.phase === 'group_stage' && match.groupName === groupName,
    )
    const teams = new Map<string, Team>()
    groupMatches.forEach((match) => {
      if (match.homeTeam) teams.set(String(match.homeTeam.id), match.homeTeam)
      if (match.awayTeam) teams.set(String(match.awayTeam.id), match.awayTeam)
    })
    const standings = new Map(
      [...teams.values()].map((team) => [String(team.id), emptyStanding(team)]),
    )
    let completedMatches = 0

    groupMatches.forEach((match) => {
      const prediction = predictionsByMatch.get(String(match.id))
      const hasResult =
        match.status === 'finished' &&
        match.homeScore !== null &&
        match.awayScore !== null
      const homeScore = hasResult ? match.homeScore : prediction?.homeScore
      const awayScore = hasResult ? match.awayScore : prediction?.awayScore

      if (
        homeScore === null ||
        homeScore === undefined ||
        awayScore === null ||
        awayScore === undefined ||
        !match.homeTeam ||
        !match.awayTeam
      ) return

      completedMatches += 1
      const home = standings.get(String(match.homeTeam.id))
      const away = standings.get(String(match.awayTeam.id))
      if (!home || !away) return

      home.played += 1
      away.played += 1
      home.goalsFor += homeScore
      home.goalsAgainst += awayScore
      away.goalsFor += awayScore
      away.goalsAgainst += homeScore
      home.goalDifference = home.goalsFor - home.goalsAgainst
      away.goalDifference = away.goalsFor - away.goalsAgainst

      if (homeScore > awayScore) home.points += 3
      else if (awayScore > homeScore) away.points += 3
      else {
        home.points += 1
        away.points += 1
      }
    })

    return {
      groupName,
      isComplete: groupMatches.length === 6 && completedMatches === 6,
      completedMatches,
      standings: [...standings.values()].sort(compareStandings),
    }
  })
}

function entrant(team: Team | null, label: string, isExact: boolean): BracketEntrant {
  return { team, label, isExact }
}

function validPrediction(
  prediction: KnockoutPrediction | undefined,
  home: BracketEntrant,
  away: BracketEntrant,
) {
  if (!prediction || !home.team || !away.team) return null
  return String(prediction.homeTeamId) === String(home.team.id) &&
    String(prediction.awayTeamId) === String(away.team.id)
    ? prediction
    : null
}

export function buildBracket(
  simulatedGroups: SimulatedGroup[],
  predictionsByMatch: Map<number, KnockoutPrediction>,
  officialMatches: Match[],
): BracketMatch[] {
  const groupsByName = new Map(
    simulatedGroups.map((group) => [group.groupName, group]),
  )
  const allGroupsComplete = simulatedGroups.every((group) => group.isComplete)
  const rankedThirds = simulatedGroups
    .filter((group) => group.isComplete && group.standings[2])
    .map((group) => ({ group: group.groupName, standing: group.standings[2] }))
    .sort((first, second) => compareStandings(first.standing, second.standing))
  const qualifiedThirds = allGroupsComplete ? rankedThirds.slice(0, 8) : []
  const qualifiedKey = qualifiedThirds.map((item) => item.group).sort().join('')
  const thirdMapping = thirdPlaceMatrix[qualifiedKey]
  const officialByNumber = new Map(
    officialMatches.flatMap((match) =>
      match.matchNumber ? [[match.matchNumber, match] as const] : [],
    ),
  )

  function resolveSource(source: RoundOf32Source, matchNumber: number) {
    if ('group' in source) {
      const group = groupsByName.get(source.group)
      const team = group?.isComplete
        ? group.standings[source.position - 1]?.team ?? null
        : null
      return entrant(
        team,
        team?.name ?? `${source.position}.${source.group}`,
        Boolean(team),
      )
    }

    const mappingIndex = thirdSlotWinners.indexOf(source.thirdForWinner)
    const mappedGroup = thirdMapping?.[mappingIndex]
    const mappedTeam = mappedGroup
      ? groupsByName.get(mappedGroup)?.standings[2]?.team ?? null
      : null
    if (mappedTeam) return entrant(mappedTeam, mappedTeam.name, true)

    const candidates = thirdCandidates[matchNumber]
      .flatMap((groupName) => {
        const group = groupsByName.get(groupName)
        return group?.isComplete && group.standings[2]
          ? [group.standings[2].team.name]
          : []
      })
    return entrant(
      null,
      candidates.length > 0
        ? `3.º posible: ${candidates.join(' / ')}`
        : `Mejor 3.º ${thirdCandidates[matchNumber].join('/')}`,
      false,
    )
  }

  function applyOfficialState(
    matchNumber: number,
    home: BracketEntrant,
    away: BracketEntrant,
  ) {
    const official = officialByNumber.get(matchNumber)
    const isLocked = official
      ? new Date(official.matchDate).getTime() <= Date.now()
      : false
    const isFinished =
      official?.status === 'finished' &&
      official.homeScore !== null &&
      official.awayScore !== null
    const useOfficialTeams =
      isLocked && official?.homeTeam !== null && official?.awayTeam !== null
    const resolvedHome =
      useOfficialTeams && official?.homeTeam
        ? entrant(official.homeTeam, official.homeTeam.name, true)
        : home
    const resolvedAway =
      useOfficialTeams && official?.awayTeam
        ? entrant(official.awayTeam, official.awayTeam.name, true)
        : away

    return {
      home: resolvedHome,
      away: resolvedAway,
      matchDate: official?.matchDate ?? null,
      actualHomeScore: isFinished ? official.homeScore : null,
      actualAwayScore: isFinished ? official.awayScore : null,
      actualWinnerId:
        isFinished && official.winnerTeamId
          ? Number(official.winnerTeamId)
          : null,
      isFinished,
      isLocked,
    }
  }

  const bracketMatches: BracketMatch[] = roundOf32.map(
    ([matchNumber, homeSource, awaySource]) => {
      const officialState = applyOfficialState(
        matchNumber,
        resolveSource(homeSource, matchNumber),
        resolveSource(awaySource, matchNumber),
      )
      return {
        matchNumber,
        round: 'round_of_32',
        ...officialState,
        prediction: officialState.isLocked
          ? predictionsByMatch.get(matchNumber) ?? null
          : validPrediction(
              predictionsByMatch.get(matchNumber),
              officialState.home,
              officialState.away,
            ),
      }
    },
  )
  const matchesByNumber = new Map(
    bracketMatches.map((match) => [match.matchNumber, match]),
  )

  function winnerOf(matchNumber: number): BracketEntrant {
    const sourceMatch = matchesByNumber.get(matchNumber)
    const winnerId =
      sourceMatch?.actualWinnerId ?? sourceMatch?.prediction?.winnerId
    const team =
      winnerId && sourceMatch
        ? [sourceMatch.home.team, sourceMatch.away.team].find(
            (candidate) => String(candidate?.id) === String(winnerId),
          ) ?? null
        : null
    return entrant(team, team?.name ?? `Ganador M${matchNumber}`, Boolean(team))
  }

  laterRounds.forEach(({ round, matches: definitions }) => {
    definitions.forEach(([matchNumber, homeMatch, awayMatch]) => {
      const officialState = applyOfficialState(
        matchNumber,
        winnerOf(homeMatch),
        winnerOf(awayMatch),
      )
      const match: BracketMatch = {
        matchNumber,
        round,
        ...officialState,
        prediction: officialState.isLocked
          ? predictionsByMatch.get(matchNumber) ?? null
          : validPrediction(
              predictionsByMatch.get(matchNumber),
              officialState.home,
              officialState.away,
            ),
      }
      bracketMatches.push(match)
      matchesByNumber.set(matchNumber, match)
    })
  })

  return bracketMatches
}
