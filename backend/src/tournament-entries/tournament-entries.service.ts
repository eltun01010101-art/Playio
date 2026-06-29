import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TournamentEntry } from './tournament-entry.entity';
import { Team } from '../teams/team.entity';
import { Tournament } from '../tournaments/tournament.entity';

@Injectable()
export class TournamentEntriesService {
  constructor(
    @InjectRepository(TournamentEntry)
    private readonly entriesRepository: Repository<TournamentEntry>,

    @InjectRepository(Team)
    private readonly teamsRepository: Repository<Team>,

    @InjectRepository(Tournament)
    private readonly tournamentsRepository: Repository<Tournament>,
  ) {}

  findAll() {
    return this.entriesRepository.find();
  }

  async findByTournament(tournamentId: string) {
    return this.entriesRepository.find({
      where: {
        tournament: {
          id: tournamentId,
        },
      },
    });
  }

  async joinTournament(data: {
    tournamentId: string;
    teamId: string;
  }) {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id: data.tournamentId },
    });

    if (!tournament) {
      throw new NotFoundException('Turnir tapılmadı');
    }

    const team = await this.teamsRepository.findOne({
      where: { id: data.teamId },
    });

    if (!team) {
      throw new NotFoundException('Komanda tapılmadı');
    }

    const existingEntry = await this.entriesRepository.findOne({
      where: {
        tournament: { id: tournament.id },
        team: { id: team.id },
      },
    });

    if (existingEntry) {
      throw new BadRequestException('Bu komanda artıq turnirə qoşulub');
    }

    const currentEntries = await this.entriesRepository.count({
      where: {
        tournament: {
          id: tournament.id,
        },
      },
    });

    if (currentEntries >= tournament.maxTeams) {
      throw new BadRequestException('Turnirdə yer qalmayıb');
    }

    const entry = this.entriesRepository.create({
      tournament,
      team,
    });

    return this.entriesRepository.save(entry);
  }
}