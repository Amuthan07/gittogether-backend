import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
     constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService
  ) {}
  async signup(dto:SignupDto) {
    const existinguser = await this.userModel.findOne({
        email: dto.email,
    })
    if(existinguser){
        throw new BadRequestException('Email already exists');
    }
    const hashedpassword = await bcrypt.hash(dto.password, 10);

    await this.userModel.create({
        email: dto.email,
        password: hashedpassword
    })
    return { message: 'User created successfully' };
  }

  async comparePassword(
    password: string,
    hash: string,
  ): Promise<Boolean>{
    return bcrypt.compare(password, hash);
  }

  async login(dto: LoginDto){
    const user = await this.userModel.findOne({
    email: dto.email,
  });
  if(!user){
        throw new BadRequestException(`Invalid credentials`);
    }
    const isPasswordValid = await this.comparePassword(
    dto.password,
    user.password,
  );
  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid credentials');
  }
  const accessToken = this.jwtService.sign({
    sub: user._id
  });
  return {
    accessToken,
  };
  }
}
