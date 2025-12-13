import { IsNotEmpty, IsString } from 'class-validator';

export class ActivateUserDto {
  @IsString({ message: 'Le mot de passe doit être une chaîne.' })
  @IsNotEmpty({ message: 'Le champ password est requis.' })
  password!: string;
}
