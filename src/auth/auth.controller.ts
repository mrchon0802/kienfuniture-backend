import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   *  Đăng nhập
   */
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } = await this.authService.login(
      email,
      password,
    );

    // Gửi Access Token vào cookie (15 phút)
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // 🔒 chỉ bật HTTPS trong production
      sameSite: 'none', // ✅ tránh lỗi CORS khi frontend & backend khác domain
      maxAge: 15 * 60 * 1000, // 15 phút
      path: '/', // ✅ cookie dùng được cho toàn bộ app
    });

    // Gửi Refresh Token vào cookie (7 ngày)
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      path: '/',
    });

    return { user };
  }

  /**
   *  Làm mới token
   */
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('Thiếu refresh token');
    }

    const {
      user,
      accessToken,
      refreshToken: newRefreshToken,
    } = await this.authService.refresh(refreshToken);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    res.cookie('refresh_token', newRefreshToken, {
      // ⚠️ nên gửi newRefreshToken
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return { user };
  }

  /**
   *  Đăng xuất
   */
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
    return { message: 'Đăng xuất thành công' };
  }
}
