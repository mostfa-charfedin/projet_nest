import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  // Propriété username : chaîne de caractères obligatoire
  @IsString({
    message: "Le nom d'utilisateur doit être une chaîne de caractères",
  })
  @IsNotEmpty({ message: "Le nom d'utilisateur est obligatoire" })
  username: string;

  // Propriété email : chaîne de caractères obligatoire avec validation d'email
  @IsEmail({}, { message: "L'email doit être une adresse email valide" })
  @IsNotEmpty({ message: "L'email est obligatoire" })
  email: string;
}
