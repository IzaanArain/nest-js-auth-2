import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './dtos/refresh-tokens.dto';
import {
  ApiBadRequestResponse,
  // ApiBody,
  // ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
// import { User } from './schemas/user.schema';

@ApiTags('TEST-AUTH')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // TODO: POST signup
  @Post('signup')
  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({
    status: 201,
    description: 'Provide success message for successful signup!',
    type: SignupDto, // ? type can be a dto or schema class
  })
  // @ApiCreatedResponse({
  //   description: 'Provide success message for successful signup!',
  //   type: User,
  // })
  // @ApiBody({ type: SignupDto }) // ? I think not needed any more , not sure
  @ApiBadRequestResponse({ description: 'Email already in use' })
  async signUp(@Body() signupData: SignupDto) {
    console.log(this.configService.get('database.connectionString'));
    return await this.authService.signup(signupData);
  }

  // TODO: POST login
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiOkResponse({
    description: 'Provide success message for successful login!',
    type: LoginDto,
  })
  // @ApiBody({ type: LoginDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Invalid credentials provided' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
  async login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  // TODO: POST refresh token
  @Post('refresh')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }
}
