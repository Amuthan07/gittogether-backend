import { IsString, IsNotEmpty} from 'class-validator'
export class LocationDto{
    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    country: string;
}