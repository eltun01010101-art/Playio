import {
  Controller,
  Get,
  Post,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { GameRoomsService } from './game-rooms.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

type AuthRequest = Request & {
  user: {
    id: string;
    email: string;
    role: string;
  };
};

@Controller('game-rooms')
export class GameRoomsController {
  constructor(
    private readonly gameRoomsService: GameRoomsService,
  ) {}

  @Get()
  findAll() {
    return this.gameRoomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameRoomsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createRoom(@Req() req: AuthRequest) {
    return this.gameRoomsService.createRoom(req.user.id);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  joinRoom(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ) {
    return this.gameRoomsService.joinRoom(
      id,
      req.user.id,
    );
  }
}