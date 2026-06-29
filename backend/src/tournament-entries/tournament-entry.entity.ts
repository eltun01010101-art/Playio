import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Team } from '../teams/team.entity';
import { Tournament } from '../tournaments/tournament.entity';

@Entity('tournament_entries')
export class TournamentEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tournament, {
    eager: true,
    onDelete: 'CASCADE',
  })
  tournament: Tournament;

  @ManyToOne(() => Team, {
    eager: true,
    onDelete: 'CASCADE',
  })
  team: Team;

  @CreateDateColumn()
  createdAt: Date;
}