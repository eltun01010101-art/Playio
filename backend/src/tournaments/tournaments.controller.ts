import { Body, Controller, Get, Post } from '@nestjs/common';

import { TournamentsService } from './tournaments.service';

@Controller('tournaments')
export class TournamentsController {
  constructor(
    private readonly tournamentsService: TournamentsService,
  ) {}

  @Get()
  findAll() {
    return this.tournamentsService.findAll();
  }

  @Post()
  create(
    @Body()
    body: {
      title: string;
      game: string;
      prizePool: number;
      maxTeams: number;
    },
  ) {
    return this.tournamentsService.create(body);
  }
}