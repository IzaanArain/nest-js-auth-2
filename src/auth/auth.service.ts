import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { compare, hash } from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
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
  }
}
