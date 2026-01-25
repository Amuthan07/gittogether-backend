import { IsString, IsEmail, IsNotEmpty, MinLength, IsArray, IsEnum, IsObject, IsBoolean, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer';
import { ExperienceLevel, Gender, ProfileMode, ProfileRole } from '../enums/create_profile.enums';
import { LocationDto } from './create-profile-location.dto';

export class CreateProfileDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(2,{message:'Name should hvae atleast 2 characters'})
    name: string;

    @IsString()
    @IsNotEmpty()
    bio:string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(Gender, {message: 'Gender must be one of: male, female, other'})
    gender: Gender;

    @IsString()
    @IsNotEmpty()
    @IsEnum(ProfileRole, {message: 'Role must be one of: frontend, backend, fullstack, qa, devops, data'})
    role: ProfileRole;

    @IsArray()
    @IsNotEmpty()
    @IsString({each:true})
    techstack: string[];

    @IsString()
    @IsNotEmpty()
    @IsEnum(ExperienceLevel)
    experienceLevel: ExperienceLevel;

    @IsNotEmpty()
    @IsEnum(ProfileMode,{message:'The values must be either dating, networking or projects'})
    mode: ProfileMode;

    @Type(()=> LocationDto)
    @ValidateNested()
    location:LocationDto;
}
