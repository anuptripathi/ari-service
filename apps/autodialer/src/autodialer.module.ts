import { Module } from '@nestjs/common';
import { AutodialerService } from './autodialer.service';

@Module({
  imports: [],
  providers: [AutodialerService],
})
export class AutodialerModule {}
