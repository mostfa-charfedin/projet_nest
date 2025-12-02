import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import * as bcryptjs from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: MongoRepository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcryptjs.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      active: false,
    });
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneById(id: string): Promise<User> {
    if (!ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid user ID: ${id}`);
    }
    const user = await this.usersRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      return user || undefined;
    } catch (error) {
      this.logger.error(`Error finding user by email: ${error}`);
      return undefined;
    }
  }

  async findActive(): Promise<User[]> {
    return this.usersRepository.find({ where: { active: true } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Vérification de l'ID
    if (!ObjectId.isValid(id)) {
      throw new NotFoundException(`ID utilisateur invalide: ${id}`);
    }

    // Recherche de l'utilisateur
    const user = await this.usersRepository.findOne({
      where: { _id: new ObjectId(id) },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    // Mise à jour des champs
    if (updateUserDto.email !== undefined && updateUserDto.email !== null) {
      user.email = updateUserDto.email as string;
    }

    if (
      updateUserDto.password !== undefined &&
      updateUserDto.password !== null
    ) {
      user.password = await bcryptjs.hash(updateUserDto.password as string, 10);
    }

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    if (!ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid user ID: ${id}`);
    }
    const result = await this.usersRepository.delete(new ObjectId(id));
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async activateAccount(email: string, password: string): Promise<User> {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    user.active = true;
    return this.usersRepository.save(user);
  }
}
