import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const expressApp = express();

  // Use raw Express middleware if needed
  expressApp.use(express.json());
  expressApp.get('/health', (req, res) => res.send('Server healthy!'));

  // Run Nest on top of Express
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  await app.listen(process.env.PORT || 3000);
  console.log(
    `🚀 Server running on http://localhost:${process.env.PORT || 3000}`,
  );
}
bootstrap();
