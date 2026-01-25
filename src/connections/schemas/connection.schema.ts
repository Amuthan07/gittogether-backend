import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export enum ConnectionMode{
    DATING = 'dating',
  NETWORKING = 'networking',
  PROJECTS = 'projects',
}
export enum ConnectionStatus{
    PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}
@Schema({timestamps:true})
export class Connection {
    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required:true
    })
    fromUser: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required:true
    })
    toUser: Types.ObjectId;

    @Prop({required:true,
        enum: ConnectionMode
    })
    mode: ConnectionMode;

    @Prop({
        required: true,
        enum: ConnectionStatus,
        default: ConnectionStatus.PENDING,
    })
    status: ConnectionStatus;
}

export type ConnectionDocument = Connection & Document;
export const ConnectionSchema = SchemaFactory.createForClass(Connection);

ConnectionSchema.index(
  { fromUser: 1, toUser: 1, mode: 1 },
  { unique: true },
);