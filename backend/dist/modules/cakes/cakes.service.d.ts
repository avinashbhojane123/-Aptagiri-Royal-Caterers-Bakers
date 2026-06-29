import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cake } from './entities/cake.entity';
import { CreateCakeDto } from './dto/create-cake.dto';
import { UpdateCakeDto } from './dto/update-cake.dto';
export declare class CakesService implements OnModuleInit {
    private cakesRepository;
    constructor(cakesRepository: Repository<Cake>);
    onModuleInit(): Promise<void>;
    findAll(search?: string, flavor?: string, page?: number, limit?: number): Promise<{
        data: Cake[];
        total: number;
    }>;
    findOne(id: string): Promise<Cake>;
    create(createCakeDto: CreateCakeDto): Promise<Cake>;
    update(id: string, updateCakeDto: UpdateCakeDto): Promise<Cake>;
    remove(id: string): Promise<void>;
}
