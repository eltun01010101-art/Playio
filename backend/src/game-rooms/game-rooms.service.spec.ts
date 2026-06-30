import { Test, TestingModule } from '@nestjs/testing';
import { GameRoomsService } from './game-rooms.service';

describe('GameRoomsService', () => {
  let service: GameRoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameRoomsService],
    }).compile();

    service = module.get<GameRoomsService>(GameRoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
