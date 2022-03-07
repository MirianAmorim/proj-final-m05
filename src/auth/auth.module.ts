import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    UserModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: process.env.SECRETKEY, //pegando a senha pra criar token
      signOptions: {
        expiresIn: '300s', //tempo de validade do token
      },
    }),
  ],
  providers: [AuthService, UserService, PrismaService],
  controllers: [AuthController],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
