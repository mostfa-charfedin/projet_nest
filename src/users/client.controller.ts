import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { Utilisateurs } from '../entities/utilisateurs';
import { RoleFilterInterceptor } from '../interceptors/role-filter.interceptor';

@Controller('client/users')
@UseInterceptors(RoleFilterInterceptor)
export class ClientController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<Utilisateurs[]> {
    return this.usersService.findAll();
  }
}
