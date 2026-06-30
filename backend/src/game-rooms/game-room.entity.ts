import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../users/user.entity';

export enum GameRoomStatus {
  WAITING = 'waiting',
  ACTIVE = 'active',
  FINISHED = 'finished',
}

@Entity('game_rooms')
export class GameRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'domino' })
  gameSlug: string;

  @ManyToOne(() => User, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  playerOne: User | null;

  @ManyToOne(() => User, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  playerTwo: User | null;

  @Column({
    type: 'enum',
    enum: GameRoomStatus,
    default: GameRoomStatus.WAITING,
  })
  status: GameRoomStatus;

  @Column({ type: 'jsonb', nullable: true })
  state: Record<string, any> | null;

  @Column({ type: 'uuid', nullable: true })
  currentTurnUserId: string | null;

  @Column({ type: 'uuid', nullable: true })
  winnerUserId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}