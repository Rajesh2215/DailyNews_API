import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserSchema } from './user.interface';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports:[MongooseModule.forFeature([
    { name: 'user', schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWTSECRET,
      signOptions: { expiresIn: '1h' },
    })
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
