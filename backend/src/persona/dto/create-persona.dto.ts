import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  Length,
} from "class-validator";
export class CreatePersonaDto {
  @IsString() @Length(1, 100) nombres: string;
  @IsString() @Length(1, 100) apellidos: string;
  @IsString() @Length(1, 20) identificacion: string;
  @IsEmail() @Length(3, 150) correo: string;
  @IsOptional() @IsString() @Length(1, 20) telefono?: string;
  @IsOptional() @IsBoolean() estado?: boolean;
}
