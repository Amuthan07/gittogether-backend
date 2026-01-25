import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { AdminSignupDto } from './dto/admin-signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/schemas/user.schema';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

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
    
    @UseGuards(RefreshAuthGuard)
    @Post('refresh')
        refreshToken(@Req() req){
            return this.authService.refreshToken(req.user.userId)
        }

    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
        logout(@CurrentUser() user: any) {
            return this.authService.logout(user.userId);
        }

    // // Option 2: Logout with Refresh Token (alternative)
    // // Use this if you want users to logout even after access token expires
    // @UseGuards(RefreshAuthGuard)
    // @Post('logout-refresh')
    //     logoutWithRefreshToken(@CurrentUser() user: any) {
    //         return this.authService.logout(user.userId);
    //     }

}
