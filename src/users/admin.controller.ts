import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { Utilisateurs } from '../entities/utilisateurs';
import { RoleFilterInterceptor } from '../interceptors/role-filter.interceptor';

@Controller('admin/users')
@UseInterceptors(RoleFilterInterceptor)
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<Utilisateurs[]> {
    return this.usersService.findAll();
  }

  @Get('active/list')
  async findActive(): Promise<Utilisateurs[]> {
    return this.usersService.findActive();
  }

  @Get('inactive/six-months')
  async findInactiveSince6Months(): Promise<Utilisateurs[]> {
    return this.usersService.findUsersNotUpdatedSince6Months();
  }

  @Get('findUsersNotUpdatedSince6Months')
  async findUsersNotUpdatedSince6Months(): Promise<Utilisateurs[]> {
    return this.usersService.findUsersNotUpdatedSince6Months();
  }

  @Get('findAllWithRoleFilter')
  async findAllWithRoleFilter(): Promise<Partial<Utilisateurs>[]> {
    return this.usersService.findAllWithRoleFilter('admin');
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Utilisateurs> {
    return this.usersService.findOneById(id);
  }
}
