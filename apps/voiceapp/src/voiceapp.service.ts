import { Injectable } from '@nestjs/common';

@Injectable()
export class VoiceappService {
  getHello(): string {
    return 'Hello World!';
  }
}
