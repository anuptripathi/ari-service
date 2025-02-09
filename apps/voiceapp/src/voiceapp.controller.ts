import { Controller, Get } from '@nestjs/common';
import { VoiceappService } from './voiceapp.service';

@Controller()
export class VoiceappController {
  constructor(private readonly voiceappService: VoiceappService) {}

  @Get()
  getHello(): string {
    return this.voiceappService.getHello();
  }
}
