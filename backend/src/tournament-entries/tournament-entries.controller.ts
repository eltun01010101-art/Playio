import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { TournamentEntriesService } from './tournament-entries.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

type AuthRequest = Request & {
  user: {
    id: string;
    email: string;
    role: string;
  };
};

@Controller('tournament-entries')
export class TournamentEntriesController {
  constructor(
    private readonly tournamentEntriesService: TournamentEntriesService,
  ) {}

  @Get()
  findAll() {
    return this.tournamentEntriesService.findAll();
  }

  @Get('tournament/:tournamentId')
  findByTournament(@Param('tournamentId') tournamentId: string) {
    return this.tournamentEntriesService.findByTournament(tournamentId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  joinTournament(
    @Req() req: AuthRequest,
    @Body()
    body: {
      tournamentId: string;
      teamId: string;
    },
  ) {
    return this.tournamentEntriesService.joinTournament(
      req.user.id,
      body,
    );
  }
}