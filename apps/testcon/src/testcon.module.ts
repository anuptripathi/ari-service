import { Module } from '@nestjs/common';
import { TestConService } from './testcon.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaModule } from '@app/common';
import { RedisModule } from '@app/common';

@Module({
  imports: [
    KafkaModule,
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true, // Ensures the config is available globally
      envFilePath: `apps/testcon/.env`, // Dynamically loads the correct .env
    }),
  ],
  providers: [TestConService, ConfigService],
  exports: [TestConService],
})
export class TestConModule {}
