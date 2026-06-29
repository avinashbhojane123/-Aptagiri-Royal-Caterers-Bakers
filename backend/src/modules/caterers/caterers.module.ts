import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatererMenu } from './entities/caterer-menu.entity';
import { CaterersService } from './caterers.service';
import { CaterersController } from './caterers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CatererMenu])],
  controllers: [CaterersController],
  providers: [CaterersService],
  exports: [CaterersService],
})
export class CaterersModule {}
