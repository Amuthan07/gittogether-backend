import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  async create(@Body() createProfileDto: CreateProfileDto) {
    const mockUserId = '65a1f1f1f1f1f1f1f1f1f1f1'
    return this.profilesService.create(mockUserId,createProfileDto);
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
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    const mockUserId = '65a1f1f1f1f1f1f1f1f1f1f1'
    return this.profilesService.update(id, mockUserId, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const mockUserId = '65a1f1f1f1f1f1f1f1f1f1f1'
    return this.profilesService.remove(id, mockUserId);
  }
}
