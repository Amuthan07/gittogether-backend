import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('profile')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  async create(@Req() req, @Body() createProfileDto: CreateProfileDto) {
   
    return this.profilesService.create(req.user.userId ,createProfileDto);
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
  update(@Req() req ,@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.update(id, req.user.id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.profilesService.remove(id, req.user.id);
  }
}
