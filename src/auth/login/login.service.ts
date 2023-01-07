import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../../api/user/user.service';

@Injectable()
export class LoginService {
  constructor(private userService: UserService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    let isPasswordMatch = false;
    const user = await this.userService.getUserByEmail(email);

    if (user) {
      isPasswordMatch = await bcrypt.compareSync(pass, user.password);
    }

    if (user && isPasswordMatch) {
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };
    }
    return null;
  }
}
