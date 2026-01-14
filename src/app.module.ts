import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfilesModule } from './profiles/profiles.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ProfilesModule, ConfigModule.forRoot({
      isGlobal: true,
    }),MongooseModule.forRoot(process.env.MONGO_DB_URI!)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
