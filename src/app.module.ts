import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { NewsModule } from './news/news.module';
import { UtilsSchema } from './utils.interface';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`${process.env.MONGO_URL}`),
    UserModule,NewsModule,MailModule
    // MongooseModule.forFeature([
    //   { name: 'utils', schema: UtilsSchema },
    // ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
