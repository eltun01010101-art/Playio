import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GameRoom, GameRoomStatus } from './game-room.entity';
import { User } from '../users/user.entity';

@Injectable()
export class GameRoomsService {
  constructor(
    @InjectRepository(GameRoom)
    private readonly gameRoomsRepository: Repository<GameRoom>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.gameRoomsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async createRoom(userId: string) {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('İstifadəçi tapılmadı');
    }

    const room = this.gameRoomsRepository.create({
      gameSlug: 'domino',
      playerOne: user,
      status: GameRoomStatus.WAITING,
      state: {},
    });

    return this.gameRoomsRepository.save(room);
  }

  async joinRoom(roomId: string, userId: string) {
    const room = await this.gameRoomsRepository.findOne({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      throw new NotFoundException('Otaq tapılmadı');
    }

    if (room.status !== GameRoomStatus.WAITING) {
      throw new BadRequestException(
        'Bu otağa artıq qoşulmaq mümkün deyil',
      );
    }

    if (room.playerOne?.id === userId) {
      throw new BadRequestException(
        'Öz otağına qoşula bilməzsən',
      );
    }

    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('İstifadəçi tapılmadı');
    }

    room.playerTwo = user;
    room.status = GameRoomStatus.ACTIVE;
    room.currentTurnUserId = room.playerOne?.id ?? null;

    return this.gameRoomsRepository.save(room);
  }

  async findOne(roomId: string) {
    const room = await this.gameRoomsRepository.findOne({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      throw new NotFoundException('Otaq tapılmadı');
    }

    return room;
  }
}