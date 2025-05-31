import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import 'reflect-metadata';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import {WinstonLoggerService} from './logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });

  app.useLogger(new WinstonLoggerService());
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

  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `Running in development mode - port ${process.env.PORT || 3000}`,
    );
    await app.listen(process.env.PORT || 3000);
  } else {
    console.log(
      `Running in production mode - port ${process.env.PORT || 3000}`,
    );
    await app.listen(process.env.PORT || 3000, '0.0.0.0');
  }
}
bootstrap();
