import { Test, TestingModule } from '@nestjs/testing';
import { TournamentEntriesService } from './tournament-entries.service';

describe('TournamentEntriesService', () => {
  let service: TournamentEntriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TournamentEntriesService],
    }).compile();

    service = module.get<TournamentEntriesService>(TournamentEntriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
