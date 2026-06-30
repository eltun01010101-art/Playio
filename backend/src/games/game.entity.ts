import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum GameStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  genre: string;

  @Column({ nullable: true })
  platform: string;

  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.ACTIVE,
  })
  status: GameStatus;

  @CreateDateColumn()
  createdAt: Date;
}