import { NestFactory } from '@nestjs/core';
import { AppFactory } from './app.factory';

void NestFactory;

async function bootstrap() {
  const { appPromise } = AppFactory.create();
  const app = await appPromise;
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Aplicação rodando na porta ${port}`);
}

bootstrap();
