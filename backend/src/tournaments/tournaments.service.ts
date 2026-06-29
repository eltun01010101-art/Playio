import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tournament } from './tournament.entity';

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
  }) {
    const tournament = this.tournamentsRepository.create(data);

    return this.tournamentsRepository.save(tournament);
  }
}