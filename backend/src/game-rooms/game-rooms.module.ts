import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GameRoomsService } from './game-rooms.service';
import { GameRoomsController } from './game-rooms.controller';
import { GameRoom } from './game-room.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GameRoom,
      User,
    ]),
  ],

  providers: [GameRoomsService],

  controllers: [GameRoomsController],

  exports: [GameRoomsService],
})
export class GameRoomsModule {}