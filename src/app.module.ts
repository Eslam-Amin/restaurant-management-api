import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestuarantsController } from './restuarants/restuarants.controller';

@Module({
  imports: [],
  controllers: [AppController, RestuarantsController],
  providers: [AppService],
})
export class AppModule {}
