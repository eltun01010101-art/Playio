import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { MatchesService } from './matches.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

type AuthRequest = Request & {
  user: {
    id: string;
    email: string;
    role: string;
  };
};

@Controller('matches')
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
  ) {}

  @Get()
  findAll() {
    return this.matchesService.findAll();
  }

  @Get('tournament/:tournamentId')
  findByTournament(
    @Param('tournamentId') tournamentId: string,
  ) {
    return this.matchesService.findByTournament(tournamentId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() req: AuthRequest,
    @Body()
    body: {
      tournamentId: string;
      teamAId?: string;
      teamBId?: string;
      round?: number;
      matchNumber?: number;
    },
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException(
        'Match yaratmaq üçün admin olmalısan',
      );
    }

    return this.matchesService.create(body);
  }

  @Post('generate/:tournamentId')
  @UseGuards(JwtAuthGuard)
  generateBracket(
    @Req() req: AuthRequest,
    @Param('tournamentId') tournamentId: string,
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException(
        'Bracket yaratmaq üçün admin olmalısan',
      );
    }

    return this.matchesService.generateBracket(tournamentId);
  }

  @Patch('finish')
  @UseGuards(JwtAuthGuard)
  finishMatch(
    @Req() req: AuthRequest,
    @Body()
    body: {
      matchId: string;
      scoreA: number;
      scoreB: number;
    },
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException(
        'Match nəticəsi daxil etmək üçün admin olmalısan',
      );
    }

    return this.matchesService.finishMatch(body);
  }
}