import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import 'reflect-metadata';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});

  const config = new DocumentBuilder()
    .setTitle('Telegram Siparis Botu')
    .setDescription('Entegrasyon')
    .setVersion('1.0')
    .addTag('getir,yemeksepeti')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
