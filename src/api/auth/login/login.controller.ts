import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Response,
  InternalServerErrorException,
} from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local.auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class LoginController {
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response({ passthrough: true }) res) {
    try {
      return req.user;
    } catch (error) {
      return res.status(error.status).json({
        message: error.message,
        status: error.status,
      });
    }
  }

  @Get('logout')
  async logout(@Request() req, @Response({ passthrough: true }) res) {
    try {
      const logoutError = await new Promise((resolve) =>
        req.logOut({ keepSessionInfo: false }, (error) => resolve(error)),
      );

      if (logoutError) {
        console.error(logoutError);
        throw new InternalServerErrorException('Could not log out user');
      }

      req.session.destroy();
      res.clearCookie('seekr-server-cookie');

      return {
        logout: true,
      };
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        status: error.status,
      });
    }
  }

  @UseGuards(AuthGuard('local'))
  @Get('status')
  async status(@Request() req, @Response({ passthrough: true }) res) {
    try {
      console.log(req);
      res.status(200).json({
        user: req.user,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        status: error.status,
      });
    }
  }
}
