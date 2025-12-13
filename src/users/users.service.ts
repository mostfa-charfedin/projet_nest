import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Utilisateurs } from '../entities/utilisateurs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Utilisateurs)
    private readonly utilisateursRepository: Repository<Utilisateurs>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Utilisateurs> {
    const utilisateur = this.utilisateursRepository.create({
      ...createUserDto,
      active: false,
    });
    return await this.utilisateursRepository.save(utilisateur);
  }

  async findAll(): Promise<Utilisateurs[]> {
    return await this.utilisateursRepository.find();
  }

  async findOneById(id: string): Promise<Utilisateurs> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('ID invalide');
    }

    const utilisateur = await this.utilisateursRepository.findOne({
      where: { _id: new ObjectId(id) } as any,
    });

    if (!utilisateur) {
      throw new NotFoundException(`Utilisateur avec id ${id} non trouvé`);
    }

    return utilisateur;
  }

  async findOneByEmail(email: string): Promise<Utilisateurs> {
    const utilisateur = await this.utilisateursRepository.findOne({
      where: { email } as any,
    });

    if (!utilisateur) {
      throw new NotFoundException(`Utilisateur avec email ${email} non trouvé`);
    }

    return utilisateur;
  }

  async findActive(): Promise<Utilisateurs[]> {
    return await this.utilisateursRepository.find({
      where: { active: true } as any,
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Utilisateurs> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('ID invalide');
    }

    const utilisateur = await this.findOneById(id);

    Object.assign(utilisateur, updateUserDto);
    utilisateur.updatedAt = new Date();

    return await this.utilisateursRepository.save(utilisateur);
  }

  async remove(id: string): Promise<void> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('ID invalide');
    }

    const utilisateur = await this.findOneById(id);

    await this.utilisateursRepository.remove(utilisateur);
  }

  async activateAccount(id: string, password: string): Promise<Utilisateurs> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('ID invalide');
    }

    const utilisateur = await this.findOneById(id);

    // Vérifier le mot de passe
    if (utilisateur.password !== password) {
      throw new BadRequestException('Mot de passe incorrect');
    }

    // Activer le compte
    utilisateur.active = true;
    utilisateur.updatedAt = new Date();
    return await this.utilisateursRepository.save(utilisateur);
  }

  /**
   * Récupère les utilisateurs avec exclusion de champs sensibles selon le rôle
   * @param role - Le rôle du demandeur ('admin' ou 'client')
   * @returns Liste des utilisateurs avec les champs filtrés
   */
  async findAllWithRoleFilter(role: string): Promise<Partial<Utilisateurs>[]> {
    const users = await this.utilisateursRepository.find();

    return users.map((user) => {
      if (role === 'admin') {
        // Admin voit tout sauf le mot de passe
        const { password, ...userWithoutPassword } = user as any;
        return userWithoutPassword;
      } else {
        // Client voit uniquement id, username et email
        return {
          id: user.id,
          username: user.username,
          email: user.email,
        };
      }
    });
  }

  async findUsersNotUpdatedSince6Months(): Promise<Utilisateurs[]> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Utilisation de MongoDB query native
    const users = await this.utilisateursRepository.find({
      where: {
        updatedAt: { $lt: sixMonthsAgo } as any,
      } as any,
    });

    return users;
  }

  async findWithAdvancedFilters(filters?: {
    role?: string;
    active?: boolean;
    updatedBefore?: Date;
    updatedAfter?: Date;
  }): Promise<Utilisateurs[]> {
    const whereConditions: any = {};

    if (filters?.role) {
      whereConditions.role = filters.role;
    }

    if (filters?.active !== undefined) {
      whereConditions.active = filters.active;
    }

    if (filters?.updatedBefore || filters?.updatedAfter) {
      whereConditions.updatedAt = {};
      if (filters?.updatedBefore) {
        whereConditions.updatedAt.$lt = filters.updatedBefore;
      }
      if (filters?.updatedAfter) {
        whereConditions.updatedAt.$gt = filters.updatedAfter;
      }
    }

    return await this.utilisateursRepository.find({
      where: whereConditions as any,
    });
  }
}
