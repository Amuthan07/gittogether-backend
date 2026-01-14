import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProfilesService {
  constructor(@InjectModel(Profile.name) private profileModel: Model<ProfileDocument>){}

  async create(userId:string,createProfileDto: CreateProfileDto): Promise<ProfileDocument>{
    return this.profileModel.create({
    ...createProfileDto,
    userId,
  });
  }

  async findAll() {
    const userProfile = await this.profileModel.find();
    if(!userProfile || (userProfile.length == 0)) throw new NotFoundException('User Profiles not found');
    return userProfile;
  }

  async findOneById(id: string) {
    const userProfile = await this.profileModel.findById(id);
    if(!userProfile) throw new NotFoundException(`User profile with ${id} is not found`);
    return userProfile;
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.profileModel.findById(id);
    if (!profile) throw new NotFoundException();
    Object.assign(profile, updateProfileDto);
    return profile.save();
  }

  async remove(id: string) {
    const userProfile = await this.profileModel.findByIdAndDelete(id);
    if(!userProfile) throw new NotFoundException(`User profile with ${id} is not found`);
    return {message:"User deleted seccessfully",userProfile};
  }
}
