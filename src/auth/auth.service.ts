import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { AdminSignupDto } from './dto/admin-signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserRole } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import refreshJwtConfig from './configs/refresh-jwt.config';
import * as config from '@nestjs/config';
import * as argon2 from 'argon2';
@Injectable()
export class AuthService {
     constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY) private refreshTokenConfig:config.ConfigType<typeof refreshJwtConfig>
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

  async createAdmin(dto: AdminSignupDto) {
    // Optional: Validate admin secret key
    // Uncomment this if you want to add extra security
    // if (dto.adminSecret !== process.env.ADMIN_SECRET_KEY) {
    //   throw new UnauthorizedException('Invalid admin secret key');
    // }

    // Check if admin already exists
    const existingUser = await this.userModel.findOne({
      email: dto.email,
    });
    
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create admin user with ADMIN role
    await this.userModel.create({
      email: dto.email,
      password: hashedPassword,
      role: UserRole.ADMIN, 
    });

    return { message: 'Admin user created successfully' };
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
    sub: user._id,
    role: user.role,
  });
  const refreshToken = this.jwtService.sign(
    {sub: user._id,
    role: user.role}, 
    {
    secret: this.refreshTokenConfig.secret,
    expiresIn: this.refreshTokenConfig.expiresIn as JwtSignOptions['expiresIn'],
  }, 
  )
  const hashedRefreshToken = await argon2.hash(refreshToken);
  await this.userModel.findOneAndUpdate({_id: user._id}, {$set: {hashedRefreshToken: hashedRefreshToken}})
  return {
    id: user._id,
    role: user.role,
    accessToken,
    refreshToken
  };
  }
   async refreshToken(userId: any){
    const user = await this.userModel.findById(userId);

  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  if (!user.hashedRefreshToken) {
    throw new UnauthorizedException('No active session found. Please login again.');
  }

  const accessToken = this.jwtService.sign({sub: user._id,role: user.role});

  return { accessToken };
   }

   async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(
      userId,
      { $unset: { hashedRefreshToken: 1 } }, 
    );

    return { message: 'Logged out successfully' };
   }
}
