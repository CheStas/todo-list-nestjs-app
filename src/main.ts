import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const swagerConfig = new DocumentBuilder()
    .setTitle('TODO list app')
    .setDescription('TODO list CRUD API')
    .setVersion('0.1')
    .build();

  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(app, swagerConfig),
  );

  await app.listen(3000);
}
bootstrap();
