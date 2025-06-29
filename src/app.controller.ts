import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { AuthGuard } from './guards/auth.guard';

@UseGuards(AuthGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get()
  someProtectedRoute(@Req() req: Request & { userId: string }) {
    console.log({ userId: req.userId });
    return { message: 'Accessed Resource', userId: req.userId };
  }
}
