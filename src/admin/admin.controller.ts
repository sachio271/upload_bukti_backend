import { Controller, Get, Param, Post } from '@nestjs/common';
import { AuthWithRoles } from 'src/auth/auth.decorator';
import { AdminService } from './admin.service';

@AuthWithRoles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('accpet/:id')
  accept(@Param('id') id: string) {
    return this.adminService.accept(+id);
  }

  @Get('all-post')
  findAllPost() {
    return this.adminService.findAllPost();
  }

  @Get('post/:id')
  findOnePost(@Param('id') id: string) {
    return this.adminService.findOnePost(+id);
  }
}
