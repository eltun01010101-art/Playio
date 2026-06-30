import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { GamesService } from './games.service';
import { GameStatus } from './game.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

type AuthRequest = Request & {
  user: {
    id: string;
    email: string;
    role: string;
  };
};

@Controller('games')
export class GamesController {
  constructor(
    private readonly gamesService: GamesService,
  ) {}

  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Get('active')
  findActive() {
    return this.gamesService.findActive();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() req: AuthRequest,

    @Body()
    body: {
      name: string;
      slug: string;
      image?: string;
      genre?: string;
      platform?: string;
      status?: GameStatus;
    },
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException(
        'Oyun yaratmaq üçün admin olmalısan',
      );
    }

    return this.gamesService.create(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Req() req: AuthRequest,

    @Param('id') id: string,

    @Body()
    body: {
      name?: string;
      slug?: string;
      image?: string;
      genre?: string;
      platform?: string;
      status?: GameStatus;
    },
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException(
        'Oyunu dəyişmək üçün admin olmalısan',
      );
    }

    return this.gamesService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Req() req: AuthRequest,

    @Param('id') id: string,
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException(
        'Oyunu silmək üçün admin olmalısan',
      );
    }

    return this.gamesService.remove(id);
  }
}