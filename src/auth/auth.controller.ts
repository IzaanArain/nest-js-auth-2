import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './dtos/refresh-tokens.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // TODO: POST signup
  @Post('signup')
  async signUp(@Body() signupData: SignupDto) {
    console.log(this.configService.get('database.connectionString'));
    return await this.authService.signup(signupData);
  }

  // TODO: POST login
  @Post('login')
  async login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  // TODO: POST refresh token
  @Post('refresh')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }
}
