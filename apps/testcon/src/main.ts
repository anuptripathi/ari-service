import { NestFactory } from '@nestjs/core';
import { TestConModule } from './testcon.module';

async function bootstrap() {
  const app = await NestFactory.create(TestConModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
