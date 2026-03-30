import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(password: string): Promise<{ access_token: string }> {
    const storedHash = this.configService.get<string>('ADMIN_PASSWORD_HASH');

    if (!storedHash) {
      throw new UnauthorizedException('Admin not configured');
    }

    const isMatch = await bcrypt.compare(password, storedHash);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { sub: 'admin', role: 'admin' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
