import { NestFactory } from '@nestjs/core';
import { AutodialerModule } from './autodialer.module';

async function bootstrap() {
  const app = await NestFactory.create(AutodialerModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
