import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const expressApp = express();

  // Use raw Express middleware if needed
  expressApp.use(express.json());
  expressApp.get('/health', (req, res) => res.send('Server healthy!'));

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  const config = new DocumentBuilder()
    .setTitle('Restaurant Management API')
    .setDescription('API for restaurant management and user recommendations')
    .setVersion('1.0')
    .addTag('App')
    .addTag('Restaurants')
    .addTag('Auth')
    .addTag('Users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT || 3000);
  console.log(
    `🚀 Server running on http://localhost:${process.env.PORT || 3000}`,
  );
}
bootstrap();
