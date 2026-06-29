import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TournamentEntry } from './tournament-entry.entity';
import { TournamentEntriesController } from './tournament-entries.controller';
import { TournamentEntriesService } from './tournament-entries.service';
import { Team } from '../teams/team.entity';
import { Tournament } from '../tournaments/tournament.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TournamentEntry, Team, Tournament])],
  controllers: [TournamentEntriesController],
  providers: [TournamentEntriesService],
})
export class TournamentEntriesModule {}