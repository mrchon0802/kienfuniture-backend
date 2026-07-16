import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  // Kiểm tra email & mật khẩu
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Email không tồn tại');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Sai mật khẩu');

    const { password: _, ...result } = user.toObject();
    return result;
  }

  // Tạo access + refresh token
  async generateTokens(user: any) {
    const payload = { sub: user._id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m', // Access token sống 15 phút
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d', // Refresh token sống 7 ngày
    });

    return { accessToken, refreshToken };
  }

  //  Đăng nhập
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const tokens = await this.generateTokens(user);
    return { user, ...tokens };
  }

  //  Cấp mới access token bằng refresh token
  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.usersService.findByEmail(payload.email);
      if (!user) throw new UnauthorizedException('Không tìm thấy user');

      const tokens = await this.generateTokens(user);
      return { user, ...tokens };
    } catch {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc hết hạn',
      );
    }
  }
}
