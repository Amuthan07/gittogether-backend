import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/users/schemas/user.schema';
import { ProfilesService } from 'src/profiles/profiles.service';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('profiles')
  getAllProfiles() {
    return this.profilesService.findAll();
  }

  @Delete('profiles/:id')
  deleteAnyProfile(@Param('id') id: string) {
    return this.profilesService.adminDelete(id);
  }
}