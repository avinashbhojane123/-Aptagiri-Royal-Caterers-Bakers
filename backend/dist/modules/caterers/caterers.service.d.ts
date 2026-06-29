import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CatererMenu } from './entities/caterer-menu.entity';
import { CreateCatererItemDto } from './dto/create-caterer-item.dto';
export declare class CaterersService implements OnModuleInit {
    private catererRepository;
    constructor(catererRepository: Repository<CatererMenu>);
    onModuleInit(): Promise<void>;
    getImageUrlForCatererItem(name: string, category: string): string;
    getMenu(): Promise<CatererMenu[]>;
    getMenuByCategory(category: string): Promise<CatererMenu[]>;
    findOne(id: string): Promise<CatererMenu>;
    addItem(createDto: CreateCatererItemDto): Promise<CatererMenu>;
    updateItem(id: string, updateDto: CreateCatererItemDto): Promise<CatererMenu>;
    deleteItem(id: string): Promise<void>;
}
