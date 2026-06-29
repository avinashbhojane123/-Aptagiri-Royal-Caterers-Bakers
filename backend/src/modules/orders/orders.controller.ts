import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user, createOrderDto);
  }

  @Get('my-orders')
  async getMyOrders(@Request() req) {
    return this.ordersService.findByUser(req.user.id);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const order = await this.ordersService.findOne(id);
    // Customers can only view their own orders; Admins can view any order
    if (req.user.role !== UserRole.ADMIN && order.user.id !== req.user.id) {
      throw new ForbiddenException(
        'You do not have permission to view this order',
      );
    }
    return order;
  }

  @Post(':id/confirm')
  async confirmOrder(
    @Param('id') id: string,
    @Body() body: { otp: string },
    @Request() req,
  ) {
    return this.ordersService.confirmOrder(id, body.otp, req.user.id);
  }

  @Roles(UserRole.ADMIN)
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(
      id,
      updateOrderStatusDto.status,
      updateOrderStatusDto.otp,
    );
  }
}
