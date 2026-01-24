import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import refreshJwtConfig from '../configs/refresh-jwt.config';
import * as config from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy,"refresh-jwt") {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    const refreshJwtSecret = process.env.REFRESH_JWT_SECRET as string;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refreshJwtSecret,
      ignoreExpiration: false,
      passReqToCallback: true, 
    });
  }

  async validate(req: any, payload: any) {
    // payload = { sub, iat, exp, role }
    const userId = payload.sub;
    

    const refreshToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const user = await this.userModel.findById(userId).select('+hashedRefreshToken');
    
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token or user logged out');
    }

    const isTokenValid = await argon2.verify(user.hashedRefreshToken, refreshToken);
    
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return { userId: payload.sub, role: payload.role };
  }
}