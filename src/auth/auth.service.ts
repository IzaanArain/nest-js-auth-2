import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hash } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}
  async signup(signupData: SignupDto) {
    const { email, password, name } = signupData;
    // TODO: check if email is in use
    const emailInUse = await this.UserModel.findOne({
      email,
    });
    if (emailInUse) {
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
}
