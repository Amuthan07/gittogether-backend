import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { AuthGuard } from '@nestjs/passport';
import { ConnectionMode, ConnectionStatus } from './schemas/connection.schema';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/interface/auth-user.interface';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Get('pendingOrReceived')
  listPendingReceived(@CurrentUser() user: AuthUser) {
    return this.connectionsService.listPendingReceived(user.userId);
  }

  @Get('pendingOrSent')
  listPendingSent(@CurrentUser() user: AuthUser) {
    return this.connectionsService.listPendingSent(user.userId);
  }

  @Get()
  listAccepted(@CurrentUser() user: AuthUser) {
    return this.connectionsService.listAccepted(user.userId);
  }

  @Post(':toUserId')
  send(
    @CurrentUser() user: AuthUser,
    @Param('toUserId') toUserId: string,
    @Body('mode') mode: ConnectionMode,
  ) {
    return this.connectionsService.send(user.userId, toUserId, mode);
  }

  @Patch(':id/accept')
  accept(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.connectionsService.accept(id, user.userId);
  }

  @Patch(':id/reject')
  reject(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.connectionsService.reject(id, user.userId);
  }

  @Delete(':id')
  cancel(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.connectionsService.cancel(id, user.userId);
  }
}
