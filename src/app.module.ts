import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountModule } from './account/accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
        envFilePath:'.env',
        isGlobal:true
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
