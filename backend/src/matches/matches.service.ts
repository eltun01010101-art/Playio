import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Match, MatchStatus } from './match.entity';
import { Team } from '../teams/team.entity';
import { Tournament, TournamentStatus } from '../tournaments/tournament.entity';
import { TournamentEntry } from '../tournament-entries/tournament-entry.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchesRepository: Repository<Match>,

    @InjectRepository(Team)
    private readonly teamsRepository: Repository<Team>,

    @InjectRepository(Tournament)
    private readonly tournamentsRepository: Repository<Tournament>,

    @InjectRepository(TournamentEntry)
    private readonly entriesRepository: Repository<TournamentEntry>,
  ) {}

  findAll() {
    return this.matchesRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findByTournament(tournamentId: string) {
    return this.matchesRepository.find({
      where: {
        tournament: {
          id: tournamentId,
        },
      },
      order: {
        round: 'ASC',
        matchNumber: 'ASC',
      },
    });
  }

  async create(data: {
    tournamentId: string;
    teamAId?: string;
    teamBId?: string;
    round?: number;
    matchNumber?: number;
  }) {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id: data.tournamentId },
    });

    if (!tournament) {
      throw new NotFoundException('Turnir tapılmadı');
    }

    let teamA: Team | null = null;
    let teamB: Team | null = null;

    if (data.teamAId) {
      teamA = await this.teamsRepository.findOne({
        where: { id: data.teamAId },
      });

      if (!teamA) {
        throw new NotFoundException('Team A tapılmadı');
      }
    }

    if (data.teamBId) {
      teamB = await this.teamsRepository.findOne({
        where: { id: data.teamBId },
      });

      if (!teamB) {
        throw new NotFoundException('Team B tapılmadı');
      }
    }

    const match = this.matchesRepository.create({
      tournament,
      teamA,
      teamB,
      round: data.round ?? 1,
      matchNumber: data.matchNumber ?? 1,
    });

    return this.matchesRepository.save(match);
  }

  async generateBracket(tournamentId: string) {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id: tournamentId },
    });

    if (!tournament) {
      throw new NotFoundException('Turnir tapılmadı');
    }

    const existingMatches = await this.matchesRepository.count({
      where: {
        tournament: {
          id: tournamentId,
        },
      },
    });

    if (existingMatches > 0) {
      throw new BadRequestException('Bu turnir üçün bracket artıq yaradılıb');
    }

    const entries = await this.entriesRepository.find({
      where: {
        tournament: {
          id: tournamentId,
        },
      },
      order: {
        createdAt: 'ASC',
      },
    });

    if (entries.length < 2) {
      throw new BadRequestException(
        'Bracket yaratmaq üçün ən azı 2 komanda olmalıdır',
      );
    }

    const matches: Match[] = [];

    for (let i = 0; i < entries.length; i += 2) {
      const match = this.matchesRepository.create({
        tournament,
        teamA: entries[i]?.team ?? null,
        teamB: entries[i + 1]?.team ?? null,
        round: 1,
        matchNumber: Math.floor(i / 2) + 1,
      });

      matches.push(match);
    }

    tournament.status = TournamentStatus.ACTIVE;
    await this.tournamentsRepository.save(tournament);

    return this.matchesRepository.save(matches);
  }

  async finishMatch(data: {
    matchId: string;
    scoreA: number;
    scoreB: number;
  }) {
    const match = await this.matchesRepository.findOne({
      where: { id: data.matchId },
    });

    if (!match) {
      throw new NotFoundException('Match tapılmadı');
    }

    if (match.status === MatchStatus.FINISHED) {
      throw new BadRequestException('Bu match artıq bitib');
    }

    if (!match.teamA || !match.teamB) {
      throw new BadRequestException('Match üçün iki komanda olmalıdır');
    }

    if (data.scoreA === data.scoreB) {
      throw new BadRequestException('Bərabərlik olmaz, qalib seçilməlidir');
    }

    const winner = data.scoreA > data.scoreB ? match.teamA : match.teamB;

    match.scoreA = data.scoreA;
    match.scoreB = data.scoreB;
    match.winner = winner;
    match.status = MatchStatus.FINISHED;

    const savedMatch = await this.matchesRepository.save(match);

    await this.moveWinnerToNextRound(savedMatch, winner);
    await this.finishTournamentIfChampion(savedMatch.tournament.id);

    return savedMatch;
  }

  private async moveWinnerToNextRound(match: Match, winner: Team) {
    const currentRoundMatches = await this.matchesRepository.find({
      where: {
        tournament: {
          id: match.tournament.id,
        },
        round: match.round,
      },
    });

    if (currentRoundMatches.length <= 1) {
      return;
    }

    const nextRound = match.round + 1;
    const nextMatchNumber = Math.ceil(match.matchNumber / 2);

    let nextMatch = await this.matchesRepository.findOne({
      where: {
        tournament: {
          id: match.tournament.id,
        },
        round: nextRound,
        matchNumber: nextMatchNumber,
      },
    });

    if (!nextMatch) {
      nextMatch = this.matchesRepository.create({
        tournament: match.tournament,
        round: nextRound,
        matchNumber: nextMatchNumber,
        teamA: null,
        teamB: null,
      });
    }

    if (match.matchNumber % 2 === 1) {
      nextMatch.teamA = winner;
    } else {
      nextMatch.teamB = winner;
    }

    await this.matchesRepository.save(nextMatch);
  }

  private async finishTournamentIfChampion(tournamentId: string) {
    const unfinishedMatches = await this.matchesRepository.count({
      where: {
        tournament: {
          id: tournamentId,
        },
        status: MatchStatus.PENDING,
      },
    });

    const allMatches = await this.matchesRepository.find({
      where: {
        tournament: {
          id: tournamentId,
        },
      },
      order: {
        round: 'DESC',
        matchNumber: 'DESC',
      },
    });

    const finalMatch = allMatches[0];

    if (
      unfinishedMatches === 0 &&
      finalMatch &&
      finalMatch.status === MatchStatus.FINISHED &&
      finalMatch.winner
    ) {
      const tournament = await this.tournamentsRepository.findOne({
        where: { id: tournamentId },
      });

      if (tournament) {
        tournament.status = TournamentStatus.FINISHED;
        await this.tournamentsRepository.save(tournament);
      }
    }
  }
}