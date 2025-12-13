import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';
import { Logger } from '@nestjs/common';

@Entity()
export class Utilisateurs {
  private readonly logger = new Logger(Utilisateurs.name);

  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ default: false })
  active!: boolean;

  @Column({ default: 'user' })
  role!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
