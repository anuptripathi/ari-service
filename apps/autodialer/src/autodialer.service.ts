import { Injectable } from '@nestjs/common';

@Injectable()
export class AutodialerService {
  getHello(): string {
    return 'Hello World!';
  }
}
