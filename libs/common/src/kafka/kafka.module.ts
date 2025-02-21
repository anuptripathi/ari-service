import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [KafkaService, ConfigService],
  exports: [KafkaService],
})
export class KafkaModule {}
