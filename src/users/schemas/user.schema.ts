import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
export type UserDocument = User & Document;

@Schema({timestamps:true})
export class User{
    @Prop({required:true, unique:true})
    email: string;

    @Prop({required:true})
    password: string;

    @Prop({default: UserRole.USER, enum: UserRole})
    role: UserRole;

    @Prop()
    hashedRefreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);