import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

type AuthRequest = Request & {
  user: {
    id: string;
    email: string;
    role: string;
  };
};

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(
    private readonly teamsService: TeamsService,
  ) {}

  @Get()
  findMine(@Req() req: AuthRequest) {
    return this.teamsService.findMyTeams(req.user.id);
  }

  @Post()
  create(
    @Req() req: AuthRequest,
    @Body()
    body: {
      name: string;
      game: string;
      logo?: string;
    },
  ) {
    return this.teamsService.create(req.user.id, body);
  }

  @Patch(':id')
  update(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      game?: string;
      logo?: string;
    },
  ) {
    return this.teamsService.update(
      req.user.id,
      id,
      body,
    );
  }

  @Delete(':id')
  remove(
    @Req() req: AuthRequest,
    @Param('id') id: string,
  ) {
    return this.teamsService.remove(
      req.user.id,
      id,
    );
  }
}