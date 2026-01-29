import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';

import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createAuthDto: CreateAuthDto) {
    const { username, email } = createAuthDto;

    const existingEmail = await this.userRepository.findOne({
      where: { email },
    });

    const existingUsername = await this.userRepository.findOne({
      where: { username },
    });

    if (existingEmail) {
      throw new HttpException({ message: 'Email already in use' }, 400);
    }

    if (existingUsername) {
      throw new HttpException({ message: 'Username already in use' }, 400);
    }

    const newUser = this.userRepository.create({
      username,
      email,
    });

    await this.userRepository.save(newUser);

    return newUser;
  }

  async signInWithGoogle(userGoogleDto: CreateAuthDto) {
    const { email, username } = userGoogleDto;

    let user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      user = this.userRepository.create({ ...userGoogleDto });
      await this.userRepository.save(user);
    }
    return user;
  }
}
