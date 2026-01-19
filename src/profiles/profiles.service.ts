import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { Model, Types } from 'mongoose';
import { UserRole } from 'src/users/schemas/user.schema';

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

  async update(id: string, userId: string, updateProfileDto: UpdateProfileDto, role: UserRole) {
    const profile = await this.profileModel.findById(id);
    if (!profile) throw new NotFoundException();
    if (!profile.userId.equals(new Types.ObjectId(userId)) && role != UserRole.ADMIN) {
    throw new ForbiddenException('You are not allowed to update this profile');
  }
    Object.assign(profile, updateProfileDto);
    return profile.save();
  }

  async remove(id: string, userId:string, role:UserRole) {
    const userProfile = await this.profileModel.findById(id);
    if(!userProfile) throw new NotFoundException(`User profile with ${id} is not found`);
    if (!userProfile.userId.equals(new Types.ObjectId(userId)) && role!=UserRole.ADMIN) {
    throw new ForbiddenException('You are not allowed to delete this profile');
  }
    await userProfile.deleteOne()
    return {message:"User deleted seccessfully",userProfile};
  }

  async adminDelete(profileId: string) {
  const profile = await this.profileModel.findById(profileId);

  if (!profile) {
    throw new NotFoundException('Profile not found');
  }

  await profile.deleteOne();
  return { message: 'Profile deleted by admin' };
}
}
