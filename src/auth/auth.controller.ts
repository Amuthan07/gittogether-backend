import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { AdminSignupDto } from './dto/admin-signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/schemas/user.schema';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('signup')
    signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
    }

    @Post('admin/signup')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    adminSignup(@Body() dto: AdminSignupDto) {
        return this.authService.createAdmin(dto);
    }
    
    @Post('login')
        login(@Body() dto: LoginDto) {
            return this.authService.login(dto);
        }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
        me(@Req() req) {
        return req.user;
        }
}
