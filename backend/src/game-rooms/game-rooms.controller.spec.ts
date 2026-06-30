import { Test, TestingModule } from '@nestjs/testing';
import { GameRoomsController } from './game-rooms.controller';

describe('GameRoomsController', () => {
  let controller: GameRoomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameRoomsController],
    }).compile();

    controller = module.get<GameRoomsController>(GameRoomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
