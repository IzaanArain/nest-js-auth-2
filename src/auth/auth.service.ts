import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { compare, hash } from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas/refresh-token.schema';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly UserModel: Model<User>,
    private readonly jwtService: JwtService,
    @InjectModel(RefreshToken.name)
    private readonly RefreshTokenModel: Model<RefreshToken>,
  ) {}

  async signup(signupData: SignupDto) {
    const { email, password, name } = signupData;
    // TODO: check if email is in use
    const emailExists = await this.UserModel.findOne({
      email,
    });
    if (emailExists) {
      throw new BadRequestException('Email already in use');
    }
    // TODO: hash password
    const hashedPassword = await hash(password, 10);
    // TODO: create user document & save it in mongodb
    await this.UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      success: true,
      message: 'Sign up successful!',
    };
  }

  async login(credentials: LoginDto) {
    const { email, password } = credentials;
    // TODO: find if user exists by email
    const user = await this.UserModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }
    // TODO: compare entered password with existing password
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }
    // TODO: generate JWT tokens
    const tokens = await this.generateUserTokens(user._id as string);

    return {
      ...tokens,
      userId: user._id,
    };
  }

  async refreshTokens(refreshToken: string) {
    const token = await this.RefreshTokenModel.findOne({
      token: refreshToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('Refresh token is invalid!');
    }

    return this.generateUserTokens(token.userId.toString());
  }

  async generateUserTokens(userId: string) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1h' }); // ? you can set secret in sign options as well
    const refreshToken = uuidv4();
    await this.storeRefreshToken(refreshToken, userId);
    return { accessToken, refreshToken };
  }

  async storeRefreshToken(token: string, userId: string) {
    // TODO: calculate expiry date 3 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);
    // ? updateOne() returns only meta data
    await this.RefreshTokenModel.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) }, // ? filter fields are used to construct the new document.
      { $set: { expiryDate, token } },
      { upsert: true, new: true },
    );
  }
}
