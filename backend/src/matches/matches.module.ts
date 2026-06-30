import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Match } from './match.entity';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

import { Team } from '../teams/team.entity';
import { Tournament } from '../tournaments/tournament.entity';
import { TournamentEntry } from '../tournament-entries/tournament-entry.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Match,
      Team,
      Tournament,
      TournamentEntry,
    ]),
  ],

  controllers: [MatchesController],

  providers: [MatchesService],

  exports: [MatchesService],
})
export class MatchesModule {}