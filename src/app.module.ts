import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import config from './config/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: '.env.local', // ? specify which .env file & .env path
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        // signOptions: { // ? you can set token expiry globally
        //   expiresIn: '1h',
        // },
      }),
      global: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('database.connectionString'),
      }),
    }),
    // JwtModule.register({ global: true, secret: 'mysecret@123' }),
    // MongooseModule.forRoot('mongodb://localhost:27017/AuthExampleDB'),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
