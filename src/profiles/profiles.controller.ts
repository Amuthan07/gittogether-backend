import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import * as authUserInterface from 'src/auth/interface/auth-user.interface';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('profile')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  async create(@CurrentUser() user: authUserInterface.AuthUser, @Body() createProfileDto: CreateProfileDto) {
   
    return this.profilesService.create(user.userId ,createProfileDto);
  }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.profilesService.findOneById(id);
  }

  @Patch(':id')
  update(@CurrentUser() user:authUserInterface.AuthUser ,@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.update(id, user.userId, updateProfileDto, user.role);
  }

  @Delete(':id')
  remove(@CurrentUser() user: authUserInterface.AuthUser, @Param('id') id: string) {
    return this.profilesService.remove(id, user.userId, user.role);
  }
}
