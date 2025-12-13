import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { AdminController } from './admin.controller';
import { ClientController } from './client.controller';
import { UsersService } from './users.service';
import { Utilisateurs } from '../entities/utilisateurs';

@Module({
  imports: [TypeOrmModule.forFeature([Utilisateurs])],
  controllers: [UsersController, AdminController, ClientController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
