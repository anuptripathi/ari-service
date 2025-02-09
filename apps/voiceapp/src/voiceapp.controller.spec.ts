import { Test, TestingModule } from '@nestjs/testing';
import { VoiceappController } from './voiceapp.controller';
import { VoiceappService } from './voiceapp.service';

describe('VoiceappController', () => {
  let voiceappController: VoiceappController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [VoiceappController],
      providers: [VoiceappService],
    }).compile();

    voiceappController = app.get<VoiceappController>(VoiceappController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(voiceappController.getHello()).toBe('Hello World!');
    });
  });
});
