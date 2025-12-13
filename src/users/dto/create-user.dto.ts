import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: "Le nom d'utilisateur doit être une chaîne." })
  @IsNotEmpty({ message: 'Le champ username est requis.' })
  username!: string;

  @IsString({ message: "L'email doit être une chaîne." })
  @IsNotEmpty({ message: 'Le champ email est requis.' })
  @IsEmail({}, { message: "L'adresse email fournie est invalide." })
  email!: string;

  @IsString({ message: 'Le mot de passe doit être une chaîne.' })
  @IsNotEmpty({ message: 'Le champ password est requis.' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères.',
  })
  password!: string;
}
