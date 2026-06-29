import { Body, Controller, Get, Post } from '@nestjs/common';

import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(
    private readonly teamsService: TeamsService,
  ) {}

  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Post()
  create(
    @Body()
    body: {
      name: string;
      game: string;
      logo?: string;
    },
  ) {
    return this.teamsService.create(body);
  }
}