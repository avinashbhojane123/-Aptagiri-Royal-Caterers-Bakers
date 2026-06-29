import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { Cake } from '../cakes/entities/cake.entity';
import { CatererMenu } from '../caterers/entities/caterer-menu.entity';

@Injectable()
export class AnalyticsService {
  private cache: { data: any; timestamp: number } | null = null;
  private readonly CACHE_TTL = 30000; // 30 seconds local in-memory cache

  constructor(private dataSource: DataSource) {}

  async getTopSellingCakes(): Promise<any[]> {
    const now = Date.now();
    if (this.cache && now - this.cache.timestamp < this.CACHE_TTL) {
      return this.cache.data;
    }

    const results = await this.dataSource
      .getRepository(OrderItem)
      .createQueryBuilder('orderItem')
      .innerJoin('orderItem.cake', 'cake')
      .select([
        'cake.id AS id',
        'cake.name AS name',
        'cake.imageUrl AS "imageUrl"',
        'cake.flavor AS flavor',
        'SUM(orderItem.quantity)::INTEGER AS "totalSold"',
        'SUM(orderItem.quantity * orderItem.pricePerUnit)::DOUBLE PRECISION AS "totalRevenue"',
      ])
      .groupBy('cake.id')
      .orderBy('"totalSold"', 'DESC')
      .limit(5)
      .getRawMany();

    this.cache = { data: results, timestamp: now };
    return results;
  }

  async getTopCaterersItems(): Promise<any[]> {
    const items = await this.dataSource.getRepository(CatererMenu).find();

    // Deterministic mock sales aggregation based on item properties
    const formatted = items.map((item) => {
      // Calculate seed sales count deterministically using string characters
      const seedCharCode = item.itemName.charCodeAt(0) || 65;
      const totalSold = ((seedCharCode + item.itemName.length) % 20) + 8;
      const totalRevenue = totalSold * Number(item.price || 5.0);

      return {
        id: item.id,
        name: item.itemName,
        category: item.category,
        totalSold,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      };
    });

    // Sort by popularity and slice top 5
    return formatted.sort((a, b) => b.totalSold - a.totalSold).slice(0, 5);
  }

  async getDashboardStats(): Promise<any> {
    const ordersRepo = this.dataSource.getRepository(Order);
    const cakesRepo = this.dataSource.getRepository(Cake);
    const caterersRepo = this.dataSource.getRepository(CatererMenu);

    const [totalOrders, outOfStockCakes, totalCateringItems] =
      await Promise.all([
        ordersRepo.count(),
        cakesRepo.count({ where: { stock: 0 } }),
        caterersRepo.count(),
      ]);

    // Sum total price of all orders that are not cancelled
    const revenueResult = await ordersRepo
      .createQueryBuilder('order')
      .select('SUM(order.totalPrice)', 'total')
      .where('order.status != :status', { status: OrderStatus.CANCELLED })
      .getRawOne();

    const totalRevenue = parseFloat(revenueResult?.total || '0');

    // Count pending vs active preparation
    const pendingOrders = await ordersRepo.count({
      where: { status: OrderStatus.PENDING },
    });
    const processingOrders = await ordersRepo.count({
      where: { status: OrderStatus.PROCESSING },
    });

    return {
      totalRevenue,
      totalOrders,
      outOfStockCakes,
      pendingOrders,
      processingOrders,
      totalCateringItems,
    };
  }
}
