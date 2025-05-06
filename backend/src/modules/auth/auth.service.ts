import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { StorageService } from '../../shared/storage/storage.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly storageService: StorageService) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.storageService.getUserByEmail(registerDto.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    return this.storageService.createUser({
      ...registerDto,
      hashedPassword,
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.storageService.getUserByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.hashedPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async getUserById(id: string) {
    const user = await this.storageService.getUserById(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}