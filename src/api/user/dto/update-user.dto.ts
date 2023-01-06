import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  FIRSTNAME_MIN_LENGTH,
  FIRSTNAME_MAX_LENGTH,
  LASTNAME_MIN_LENGTH,
  LASTNAME_MAX_LENGTH,
  EMAIL_MIN_LENGTH,
  EMAIL_MAX_LENGTH,
} from '../../../util/constants';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsNotEmpty()
  @MinLength(FIRSTNAME_MIN_LENGTH)
  @MaxLength(FIRSTNAME_MAX_LENGTH)
  @IsAlpha()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(LASTNAME_MIN_LENGTH)
  @MaxLength(LASTNAME_MAX_LENGTH)
  @IsAlpha()
  public lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(EMAIL_MIN_LENGTH)
  @MaxLength(EMAIL_MAX_LENGTH)
  @IsAlpha()
  public email: string;
}
