import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { Connection, ConnectionDocument, ConnectionMode, ConnectionStatus } from './schemas/connection.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ConnectionsService {
  constructor(
  @InjectModel(Connection.name)
  private readonly connectionModel: Model<ConnectionDocument>,
) {}

  async send(
    fromUser: string,
    toUser: string,
    mode: ConnectionMode
  ) {
    if (fromUser === toUser) {
      throw new BadRequestException('Cannot send connection request to yourself');
    }

    const existingConnection = await this.connectionModel.findOne({
      fromUser,
      toUser,
      mode,
    });

    if (existingConnection) {
      throw new BadRequestException('Connection request already sent');
    }

    const connection = await this.connectionModel.create({
      fromUser,
      toUser,
      mode,
    });

    if (mode === ConnectionMode.DATING) {
      const reverse = await this.connectionModel.findOne({
        fromUser: toUser,
        toUser: fromUser,
        mode,
      });

      if (reverse) {
        connection.status = ConnectionStatus.ACCEPTED;
        reverse.status = ConnectionStatus.ACCEPTED;
        await Promise.all([connection.save(), reverse.save()]);
        return { connection, message: 'Match! Mutual connection accepted' };
      }
    }

    return connection;
  }

  async accept(connectionId: string, userId: string) {
    const connection = await this.connectionModel.findById(connectionId);

    if (!connection) {
      throw new NotFoundException('Connection request not found');
    }

    if (!connection.toUser.equals(userId)) {
      throw new ForbiddenException('You can only accept requests sent to you');
    }

    if (connection.status === ConnectionStatus.ACCEPTED) {
      throw new BadRequestException('Connection already accepted');
    }

    connection.status = ConnectionStatus.ACCEPTED;
    return connection.save();
  }

  async reject(connectionId: string, userId: string) {
    const connection = await this.connectionModel.findById(connectionId);

    if (!connection) {
      throw new NotFoundException('Connection request not found');
    }

    if (!connection.toUser.equals(userId)) {
      throw new ForbiddenException('You can only reject requests sent to you');
    }

    connection.status = ConnectionStatus.REJECTED;
    return connection.save();
  }

  async listAccepted(userId: string) {
    return this.connectionModel.find({
      $or: [
        { fromUser: userId },
        { toUser: userId },
      ],
      status: ConnectionStatus.ACCEPTED,
    }).populate('fromUser toUser', 'email');
  }

  async listPendingReceived(userId: string) {
    return this.connectionModel.find({
      toUser: userId,
      status: ConnectionStatus.PENDING,
    }).populate('fromUser', 'email');
  }

  async listPendingSent(userId: string) {
    return this.connectionModel.find({
      fromUser: userId,
      status: ConnectionStatus.PENDING,
    }).populate('toUser', 'email');
  }

  async cancel(connectionId: string, userId: string) {
    const connection = await this.connectionModel.findById(connectionId);

    if (!connection) {
      throw new NotFoundException('Connection request not found');
    }

    if (!connection.fromUser.equals(userId)) {
      throw new ForbiddenException('You can only cancel requests you sent');
    }

    if (connection.status !== ConnectionStatus.PENDING) {
      throw new BadRequestException('Can only cancel pending requests');
    }

    await connection.deleteOne();
    return { message: 'Connection request cancelled' };
  }
}
