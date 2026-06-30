import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Game, GameStatus } from './game.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gamesRepository: Repository<Game>,
  ) {}

  findAll() {
    return this.gamesRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  findActive() {
    return this.gamesRepository.find({
      where: {
        status: GameStatus.ACTIVE,
      },
      order: {
        name: 'ASC',
      },
    });
  }

  async create(data: {
    name: string;
    slug: string;
    image?: string;
    genre?: string;
    platform?: string;
    status?: GameStatus;
  }) {
    const game = this.gamesRepository.create({
      ...data,
      status: data.status ?? GameStatus.ACTIVE,
    });

    return this.gamesRepository.save(game);
  }

  async update(
    id: string,
    data: {
      name?: string;
      slug?: string;
      image?: string;
      genre?: string;
      platform?: string;
      status?: GameStatus;
    },
  ) {
    const game = await this.gamesRepository.findOne({
      where: { id },
    });

    if (!game) {
      throw new NotFoundException('Oyun tapılmadı');
    }

    Object.assign(game, data);

    return this.gamesRepository.save(game);
  }

  async remove(id: string) {
    const game = await this.gamesRepository.findOne({
      where: { id },
    });

    if (!game) {
      throw new NotFoundException('Oyun tapılmadı');
    }

    await this.gamesRepository.remove(game);

    return {
      success: true,
      message: 'Oyun silindi',
    };
  }
}