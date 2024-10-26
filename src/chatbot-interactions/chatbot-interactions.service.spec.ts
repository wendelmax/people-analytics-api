import { Test, TestingModule } from '@nestjs/testing';
import { ChatbotInteractionsService } from './chatbot-interactions.service';

describe('ChatbotInteractionsService', () => {
  let service: ChatbotInteractionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatbotInteractionsService],
    }).compile();

    service = module.get<ChatbotInteractionsService>(ChatbotInteractionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
