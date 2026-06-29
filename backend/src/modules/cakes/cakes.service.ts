import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Cake, CakeSize } from './entities/cake.entity';
import { CreateCakeDto } from './dto/create-cake.dto';
import { UpdateCakeDto } from './dto/update-cake.dto';

@Injectable()
export class CakesService implements OnModuleInit {
  constructor(
    @InjectRepository(Cake)
    private cakesRepository: Repository<Cake>,
  ) {}

  async onModuleInit() {
    const count = await this.cakesRepository.count();
    if (count === 0) {
      console.log('No cakes found in database. Seeding default catalog...');
      const defaultCakes: CreateCakeDto[] = [
        {
          name: 'Chocolate Fudge Decadence',
          description:
            'Rich triple-layer chocolate sponge smothered in velvety fudge icing. A chocolate lover’s ultimate dream.',
          price: 24.99,
          stock: 12,
          imageUrl:
            'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
          flavor: 'Chocolate',
          size: CakeSize.MEDIUM,
        },
        {
          name: 'Red Velvet Classic',
          description:
            'Traditional light cocoa red velvet sponge topped with thick, luxurious vanilla cream cheese frosting.',
          price: 28.5,
          stock: 8,
          imageUrl:
            'https://images.unsplash.com/photo-1586985289688-ca9cf49d3ad0?w=600&auto=format&fit=crop&q=80',
          flavor: 'Red Velvet',
          size: CakeSize.MEDIUM,
        },
        {
          name: 'Strawberry Fields Shortcake',
          description:
            'Light sponge cake layered with sweet vanilla whipped cream and fresh organic strawberries.',
          price: 22.0,
          stock: 15,
          imageUrl:
            'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop&q=80',
          flavor: 'Strawberry',
          size: CakeSize.SMALL,
        },
        {
          name: 'Madagascar Vanilla Dream',
          description:
            'Elegant vanilla sponge flavored with genuine Madagascar vanilla beans and whipped buttercream.',
          price: 19.99,
          stock: 10,
          imageUrl:
            'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=600&auto=format&fit=crop&q=80',
          flavor: 'Vanilla',
          size: CakeSize.MEDIUM,
        },
        {
          name: 'Lemon Blueberry Zest',
          description:
            'Zesty double-layer lemon cake baked with fresh blueberries and topped with a sweet citrus glaze.',
          price: 26.0,
          stock: 5,
          imageUrl:
            'https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format&fit=crop&q=80',
          flavor: 'Lemon',
          size: CakeSize.LARGE,
        },
      ];

      for (const cake of defaultCakes) {
        await this.create(cake);
      }
      console.log('Database seeded with 5 default cakes.');
    }
  }

  async findAll(
    search?: string,
    flavor?: string,
    page = 1,
    limit = 9,
  ): Promise<{ data: Cake[]; total: number }> {
    const where: any = {};

    if (search) {
      where.name = Like(`%${search}%`);
    }
    if (flavor) {
      where.flavor = flavor;
    }

    const [data, total] = await this.cakesRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, total };
  }

  async findOne(id: string): Promise<Cake> {
    const cake = await this.cakesRepository.findOne({ where: { id } });
    if (!cake) {
      throw new NotFoundException(`Cake with ID ${id} not found`);
    }
    return cake;
  }

  async create(createCakeDto: CreateCakeDto): Promise<Cake> {
    const cake = this.cakesRepository.create(createCakeDto);
    return this.cakesRepository.save(cake);
  }

  async update(id: string, updateCakeDto: UpdateCakeDto): Promise<Cake> {
    const cake = await this.findOne(id);
    Object.assign(cake, updateCakeDto);
    return this.cakesRepository.save(cake);
  }

  async remove(id: string): Promise<void> {
    const cake = await this.findOne(id);
    await this.cakesRepository.remove(cake);
  }
}
