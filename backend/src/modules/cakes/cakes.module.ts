import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cake } from './entities/cake.entity';
import { CakesService } from './cakes.service';
import { CakesController } from './cakes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cake])],
  controllers: [CakesController],
  providers: [CakesService],
  exports: [CakesService],
})
export class CakesModule {}
