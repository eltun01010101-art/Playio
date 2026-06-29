import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { TournamentEntriesService } from './tournament-entries.service';

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
  joinTournament(
    @Body()
    body: {
      tournamentId: string;
      teamId: string;
    },
  ) {
    return this.tournamentEntriesService.joinTournament(body);
  }
}