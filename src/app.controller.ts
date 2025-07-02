import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// @UseGuards(AuthGuard) // ? this would set auth guard for all api routes in this controller

@ApiTags('TEST-APP')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('test')
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('some-protected-route')
  someProtectedRoute(@Req() req: Request & { userId: string }) {
    console.log({ userId: req.userId });
    return { message: 'Accessed Resource', userId: req.userId };
  }
}
