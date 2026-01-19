import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

/**
 * DTO for admin user signup
 * Extends the basic signup with an optional admin secret key for security
 */
export class AdminSignupDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @IsOptional()
    adminSecret?: string; // Optional: for additional security check
}
