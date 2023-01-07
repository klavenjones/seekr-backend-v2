import {
  IsAlpha,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsString,
  IsEmail,
} from 'class-validator';

import {
  EMAIL_MAX_LENGTH,
  EMAIL_MIN_LENGTH,
  FIRSTNAME_MAX_LENGTH,
  FIRSTNAME_MIN_LENGTH,
  LASTNAME_MAX_LENGTH,
  LASTNAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../../../util/constants';

export class CreateUserDto {
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
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(PASSWORD_MIN_LENGTH)
  @MaxLength(PASSWORD_MAX_LENGTH)
  public password;
}
