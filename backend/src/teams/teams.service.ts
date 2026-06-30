import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Team } from './team.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamsRepository: Repository<Team>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findMyTeams(userId: string) {
    return this.teamsRepository.find({
      where: {
        owner: {
          id: userId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async create(
    userId: string,
    data: {
      name: string;
      game: string;
      logo?: string;
    },
  ) {
    const owner = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!owner) {
      throw new NotFoundException('İstifadəçi tapılmadı');
    }

    const team = this.teamsRepository.create({
      ...data,
      owner,
    });

    return this.teamsRepository.save(team);
  }

  async update(
    userId: string,
    teamId: string,
    data: {
      name?: string;
      game?: string;
      logo?: string;
    },
  ) {
    const team = await this.teamsRepository.findOne({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('Komanda tapılmadı');
    }

    if (team.owner?.id !== userId) {
      throw new ForbiddenException('Bu komandanı dəyişmək icazən yoxdur');
    }

    Object.assign(team, data);

    return this.teamsRepository.save(team);
  }

  async remove(userId: string, teamId: string) {
    const team = await this.teamsRepository.findOne({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('Komanda tapılmadı');
    }

    if (team.owner?.id !== userId) {
      throw new ForbiddenException('Bu komandanı silmək icazən yoxdur');
    }

    await this.teamsRepository.remove(team);

    return {
      success: true,
      message: 'Komanda silindi',
    };
  }
}