import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CaterersService } from './caterers.service';
import { CreateCatererItemDto } from './dto/create-caterer-item.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('caterers')
export class CaterersController {
  constructor(private readonly caterersService: CaterersService) {}

  @Get('menu')
  async getMenu() {
    return this.caterersService.getMenu();
  }

  @Get('menu/:id')
  async findOne(@Param('id') id: string) {
    return this.caterersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('menu')
  async addItem(@Body() createDto: CreateCatererItemDto) {
    return this.caterersService.addItem(createDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('menu/:id')
  async updateItem(
    @Param('id') id: string,
    @Body() updateDto: CreateCatererItemDto,
  ) {
    return this.caterersService.updateItem(id, updateDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('menu/:id')
  async deleteItem(@Param('id') id: string) {
    return this.caterersService.deleteItem(id);
  }
}
