import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  // ? swagger initial configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NEST-AUTH')
    .setDescription('This is a test API documentation!')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  // ? generation swagger document
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api/v1', app, swaggerDocument);

  const config = app.get(ConfigService);
  const port = config.get<number>('port');
  await app.listen(port ?? 3000);
}
bootstrap();
