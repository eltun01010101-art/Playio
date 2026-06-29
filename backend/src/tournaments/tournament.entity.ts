import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TournamentStatus {
  UPCOMING = 'upcoming',
  ACTIVE = 'active',
  FINISHED = 'finished',
}

@Entity('tournaments')
export class Tournament {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  game: string;

  @Column({ type: 'int', default: 0 })
  prizePool: number;

  @Column({ type: 'int', default: 16 })
  maxTeams: number;

  @Column({
    type: 'enum',
    enum: TournamentStatus,
    default: TournamentStatus.UPCOMING,
  })
  status: TournamentStatus;

  @CreateDateColumn()
  createdAt: Date;
}