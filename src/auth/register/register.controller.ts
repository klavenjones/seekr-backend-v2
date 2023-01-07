import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
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
      //Lets check if the error is thrown due to the user existing already
      if (
        error instanceof HttpException &&
        error.getStatus() === HttpStatus.CONFLICT
      ) {
        //If so, let's send this tho the client
        return res.status(error.getStatus()).json({
          message: 'A user with this email already exists',
          status: error.getStatus(),
        });
      }
      //If not, let's send a standard error. NOTE: Maybe we can implement an exception filter in the future
      return res.status(error.status).json({
        message: error.message,
        status: error.status,
      });
    }
  }
}
