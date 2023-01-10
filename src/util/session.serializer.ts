import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/api/user/entities/user.entity';
import { UserService } from 'src/api/user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private userService: UserService) {
    super();
  }

  serializeUser(user: User, done: (err, user: User) => void) {
    done(null, user);
  }

  async deserializeUser(payload: User, done: (err, user: User) => void) {
    const user = await this.userService.findOne(6);
    return user ? done(null, user) : done(null, null);
  }
}
