import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('mongo.uri');
        const dbName = configService.get<string>('mongo.dbName');
        const logger = new Logger('DatabaseModule');

        logger.log(`Connecting to MongoDB → ${uri}${dbName}`);

        mongoose.set('debug', true);

        return { uri, dbName };
      },
    }),
  ],
  providers: [],
})
export class DatabaseModule {}
