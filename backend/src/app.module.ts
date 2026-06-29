import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/users/entities/user.entity';
import { Cake } from './modules/cakes/entities/cake.entity';
import { Order } from './modules/orders/entities/order.entity';
import { OrderItem } from './modules/orders/entities/order-item.entity';
import { Payment } from './modules/payments/entities/payment.entity';
import { CatererMenu } from './modules/caterers/entities/caterer-menu.entity';
import { UsersModule } from './modules/users/users.module';
import { CakesModule } from './modules/cakes/cakes.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { CaterersModule } from './modules/caterers/caterers.module';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'cake_shop',
        entities: [User, Cake, Order, OrderItem, Payment, CatererMenu],
        synchronize: true,
      }),
    }),
    UsersModule,
    CakesModule,
    AuthModule,
    OrdersModule,
    PaymentsModule,
    AnalyticsModule,
    CaterersModule,
    WhatsappModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
