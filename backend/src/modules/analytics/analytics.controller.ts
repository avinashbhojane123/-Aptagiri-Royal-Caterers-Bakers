import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('top-selling')
  async getTopSelling() {
    return this.analyticsService.getTopSellingCakes();
  }

  @Get('caterers-top-selling')
  async getCaterersTopSelling() {
    return this.analyticsService.getTopCaterersItems();
  }

  @Get('stats')
  async getStats() {
    return this.analyticsService.getDashboardStats();
  }
}
