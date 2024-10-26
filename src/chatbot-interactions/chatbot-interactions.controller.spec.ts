import { Test, TestingModule } from '@nestjs/testing';
import { ChatbotInteractionsController } from './chatbot-interactions.controller';

describe('ChatbotInteractionsController', () => {
  let controller: ChatbotInteractionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatbotInteractionsController],
    }).compile();

    controller = module.get<ChatbotInteractionsController>(ChatbotInteractionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
