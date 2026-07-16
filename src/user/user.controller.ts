// src/user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Tạo user mới (tương ứng addUser)
  @Post()
  create(@Body() userData: Partial<User>) {
    return this.userService.create(userData);
  }

  // Lấy toàn bộ user (tương ứng state.users)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // Lấy user theo ID
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  // Tìm user theo email (tương ứng setEmailLogin)
  @Get('/email/:email')
  async findByEmail(@Param('email') email: string) {
    const user = await this.userService.findByEmail(email);
    return user || null;
  }

  // Cập nhật user (tương ứng updateUser)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<User>) {
    return this.userService.update(id, updateData);
  }

  // Xoá user (tương ứng removeUser)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  // Xoá tất cả user (tương ứng clearUser)
  @Delete()
  clearAll() {
    return this.userService.clearAll();
  }
}
