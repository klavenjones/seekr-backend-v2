import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { RegisterService } from './register.service';
import { CreateUserDto } from '../../api/user/dto/create-user.dto';

@Controller('auth')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('register')
  public async register(
    @Res() res,
    @Body() createUserDto: CreateUserDto,
  ): Promise<any> {
    try {
      await this.registerService.register(createUserDto);
      return res.status(HttpStatus.CREATED).json({
        message: `Hey ${createUserDto.firstName}, your account was created successfully`,
        status: 201,
      });
    } catch (error) {
      return res.status(error.status).json({
        message: error.message,
        status: error.status,
      });
    }
  }
}
