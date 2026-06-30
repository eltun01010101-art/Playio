import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Team } from './team.entity';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Team,
      User,
    ]),
  ],

  controllers: [TeamsController],

  providers: [TeamsService],

  exports: [TeamsService],
})
export class TeamsModule {}