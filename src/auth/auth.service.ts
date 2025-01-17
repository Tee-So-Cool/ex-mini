import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({ username, password: hashedPassword });
    return this.userRepository.save(newUser);
  }

  async login(username: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({ sub: user.id, username: user.username }, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' });

    user.refreshToken = refreshToken;
    await this.userRepository.save(user);

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({ where: { refreshToken } });
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newAccessToken = this.jwtService.sign({ sub: user.id, username: user.username }, { expiresIn: '15m' });
    return { accessToken: newAccessToken };
  }

  async logout(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.refreshToken = null;
    await this.userRepository.save(user);
  }
}
