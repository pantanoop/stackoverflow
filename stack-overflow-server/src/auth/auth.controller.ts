/* eslint-disable */
import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  registerUser(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.createUser(createAuthDto);
  }

  @Post('/login/google')
  signInWithGoogle(@Body() userGoogleDto: CreateAuthDto) {
    return this.authService.signInWithGoogle(userGoogleDto);
  }
}
