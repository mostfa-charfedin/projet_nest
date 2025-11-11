import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

interface User {
  id: number;
  username: string;
  email: string;
  status: string;
}

@Controller('users')
export class UsersController {
  private users: User[] = [
    {
      id: 1,
      username: 'Mohamed',
      email: 'mohamed@esprit.tn',
      status: 'active',
    },
    { id: 2, username: 'Sarra', email: 'sarra@esprit.tn', status: 'inactive' },
    { id: 3, username: 'Ali', email: 'ali@esprit.tn', status: 'inactive' },
    { id: 4, username: 'Eya', email: 'eya@esprit.tn', status: 'active' },
  ];

  @Get()
  getAllUsers(@Query('status') status?: string) {
    if (status) {
      return this.users.filter((user) => user.status === status);
    }
    return this.users;
  }

  @Get('active/:status')
  getActiveUsers(@Param('status') status: string) {
    return this.users.filter((user) => user.status === status);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    const user = this.users.find((u) => u.id === parseInt(id));
    if (!user) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  // 1. Utilisation du DTO CreateUserDto dans la méthode de création
  @Post()
  createUser(
    @Body() createUserDto: CreateUserDto,
    @Headers('authorization') authorization: string,
  ) {
    console.log('Authorization header:', authorization);

    const newUser: User = {
      id: this.users.length + 1,
      username: createUserDto.username,
      email: createUserDto.email,
      status: 'active', // Par défaut
    };

    this.users.push(newUser);
    return {
      message: 'Utilisateur créé avec succès',
      user: newUser,
    };
  }

  // 2. Utilisation du DTO CreateUserDto dans la méthode de mise à jour
  @Put(':id')
  updateUser(@Param('id') id: string, @Body() createUserDto: CreateUserDto) {
    const userIndex = this.users.findIndex((u) => u.id === parseInt(id));

    if (userIndex === -1) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      username: createUserDto.username,
      email: createUserDto.email,
    };

    return {
      message: 'Utilisateur mis à jour avec succès',
      user: this.users[userIndex],
    };
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    const userIndex = this.users.findIndex((u) => u.id === parseInt(id));

    if (userIndex === -1) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }

    const deletedUser = this.users.splice(userIndex, 1);
    return {
      message: 'Utilisateur supprimé avec succès',
      user: deletedUser[0],
    };
  }
}
