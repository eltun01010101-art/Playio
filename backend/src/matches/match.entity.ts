import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Team } from '../teams/team.entity';
import { Tournament } from '../tournaments/tournament.entity';

export enum MatchStatus {
  PENDING = 'pending',
  FINISHED = 'finished',
}

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tournament, {
    eager: true,
    onDelete: 'CASCADE',
  })
  tournament: Tournament;

  @ManyToOne(() => Team, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  teamA: Team | null;

  @ManyToOne(() => Team, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  teamB: Team | null;

  @ManyToOne(() => Team, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  winner: Team | null;

  @Column({ type: 'int', default: 1 })
  round: number;

  @Column({ type: 'int', default: 1 })
  matchNumber: number;

  @Column({ type: 'int', nullable: true })
  scoreA: number | null;

  @Column({ type: 'int', nullable: true })
  scoreB: number | null;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.PENDING,
  })
  status: MatchStatus;

  @CreateDateColumn()
  createdAt: Date;
}