import { CakesService } from './cakes.service';
import { CreateCakeDto } from './dto/create-cake.dto';
import { UpdateCakeDto } from './dto/update-cake.dto';
export declare class CakesController {
    private readonly cakesService;
    constructor(cakesService: CakesService);
    findAll(search?: string, flavor?: string, page?: string, limit?: string): Promise<{
        data: import("./entities/cake.entity").Cake[];
        total: number;
    }>;
    findOne(id: string): Promise<import("./entities/cake.entity").Cake>;
    create(createCakeDto: CreateCakeDto): Promise<import("./entities/cake.entity").Cake>;
    update(id: string, updateCakeDto: UpdateCakeDto): Promise<import("./entities/cake.entity").Cake>;
    remove(id: string): Promise<void>;
}
