import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ExperienceLevel, ProfileMode, UserRole } from '../enums/create_profile.enums';

export type ProfileDocument = Profile & Document;
@Schema({ timestamps: true })

export class Profile {
@Prop({ type: Types.ObjectId, required: true, unique: true })
userId: Types.ObjectId;

@Prop({ required: true, minlength: 2 })
name: string;

@Prop({ required: true })
bio: string;

@Prop({ enum: UserRole, required: true })
role: UserRole;

@Prop({ type: [String], required: true })
techstack: string[];

@Prop({ enum: ExperienceLevel, required: true })
experienceLevel: ExperienceLevel;

@Prop({ enum: ProfileMode, required: true })
mode: ProfileMode;

@Prop({
    type: {
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
    required: true,
     _id: false 
  })
  location: {
    city: string;
    country: string;
  };

  @Prop({ default: false })
isProfileComplete: boolean;

}
export const ProfileSchema = SchemaFactory.createForClass(Profile);

ProfileSchema.pre('save', function () {
  this.isProfileComplete =
    !!this.name &&
    !!this.bio &&
    this.techstack?.length > 0 &&
    !!this.location;
});
