import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../api/user/dto/create-user.dto';
import { User } from '../../api/user/entities/user.entity';
import { UserService } from '../../api/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterService {
  constructor(private readonly userService: UserService) {}

  public async register(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userService.getUserByEmail(createUserDto.email);
    if (user) {
      throw new HttpException(
        'A user with this email address already exists',
        HttpStatus.CONFLICT,
      );
    }
    createUserDto.password = bcrypt.hashSync(createUserDto.password, 8);
    return this.userService.create(createUserDto);
  }
}
