import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Team } from './team.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamsRepository: Repository<Team>,
  ) {}

  findAll() {
    return this.teamsRepository.find();
  }

  create(data: {
    name: string;
    game: string;
    logo?: string;
  }) {
    const team = this.teamsRepository.create(data);

    return this.teamsRepository.save(team);
  }
}