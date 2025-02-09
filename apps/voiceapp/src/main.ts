import { NestFactory } from '@nestjs/core';
import { AppModule } from './voiceapp.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(
              ({ level, message, timestamp }) =>
                `[${timestamp}] ${level}: ${message}`,
            ),
          ),
        }),
      ],
    }),
  });

  await app.listen(3000);
  console.log(`Voice application listening on port 3000`);
}
bootstrap();
