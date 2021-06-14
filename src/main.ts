import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import "reflect-metadata";
import { createConnection } from 'typeorm';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  await createConnection();
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('Telegram Siparis Botu')
    .setDescription('Entegrasyon')
    .setVersion('1.0')
    .addTag('getir,yemeksepeti')
    .addSecurity('SecurityScheme', { scheme: 'Bearer', description: '', type: 'http', in: 'header', bearerFormat: 'JWT', name: 'JWT Authentication' })
    .addSecurityRequirements('SecurityScheme')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);


  await app.listen(3001);
}
bootstrap();
