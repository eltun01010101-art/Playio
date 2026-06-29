import { Test, TestingModule } from '@nestjs/testing';
import { TournamentEntriesController } from './tournament-entries.controller';

describe('TournamentEntriesController', () => {
  let controller: TournamentEntriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TournamentEntriesController],
    }).compile();

    controller = module.get<TournamentEntriesController>(TournamentEntriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
