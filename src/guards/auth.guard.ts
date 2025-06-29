import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request & { userId: string } = context // ? better to create your own request class and extend it express request
      .switchToHttp()
      .getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      //   return false; // ? canActivate by default throws a Forbidden 403 error on returning false
      throw new UnauthorizedException('Invalid token!');
    }

    try {
      const payload = this.jwtService.verify<{ userId: string }>(token);
      request.userId = payload.userId;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Invalid Token';
      Logger.error(errorMessage);
      throw new UnauthorizedException('Invalid Token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers.authorization?.split(' ')[1];
  }
}
