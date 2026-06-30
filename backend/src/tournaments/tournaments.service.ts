import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tournament, TournamentStatus } from './tournament.entity';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentsRepository: Repository<Tournament>,
  ) {}

  findAll() {
    return this.tournamentsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  create(data: {
    title: string;
    game: string;
    prizePool: number;
    maxTeams: number;
    status?: TournamentStatus;
  }) {
    const tournament = this.tournamentsRepository.create({
      ...data,
      status: data.status ?? TournamentStatus.UPCOMING,
    });

    return this.tournamentsRepository.save(tournament);
  }

  async update(
    id: string,
    data: {
      title?: string;
      game?: string;
      prizePool?: number;
      maxTeams?: number;
      status?: TournamentStatus;
    },
  ) {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id },
    });

    if (!tournament) {
      throw new NotFoundException('Turnir tapılmadı');
    }

    Object.assign(tournament, data);

    return this.tournamentsRepository.save(tournament);
  }

  async remove(id: string) {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id },
    });

    if (!tournament) {
      throw new NotFoundException('Turnir tapılmadı');
    }

    await this.tournamentsRepository.remove(tournament);

    return {
      success: true,
      message: 'Turnir silindi',
    };
  }
}