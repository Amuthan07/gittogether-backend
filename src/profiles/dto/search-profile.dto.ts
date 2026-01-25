import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { ExperienceLevel, ProfileMode, ProfileRole } from "../enums/create_profile.enums";
import { Type } from "class-transformer";
import { Profile } from "../schemas/profile.schema";



export class SearchProfileDto{
    @IsOptional()
    @IsEnum(ProfileRole)
    role?:ProfileRole;

    @IsOptional()
    @IsArray()
    @Type(() => String)
    techstack?: string[];

    @IsOptional()
    @IsEnum(ExperienceLevel)
    experienceLevel?: ExperienceLevel;

    @IsOptional()
    @IsEnum(ProfileMode)
    mode:ProfileMode;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    page?: number = 1;

    @IsOptional()
    limit?: number = 10;
}

export interface SearchProfilesResponse {
  page: number;
  limit: number;
  total: number;
  results: Profile[];
}