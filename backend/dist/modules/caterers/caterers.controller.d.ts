import { CaterersService } from './caterers.service';
import { CreateCatererItemDto } from './dto/create-caterer-item.dto';
export declare class CaterersController {
    private readonly caterersService;
    constructor(caterersService: CaterersService);
    getMenu(): Promise<import("./entities/caterer-menu.entity").CatererMenu[]>;
    findOne(id: string): Promise<import("./entities/caterer-menu.entity").CatererMenu>;
    addItem(createDto: CreateCatererItemDto): Promise<import("./entities/caterer-menu.entity").CatererMenu>;
    updateItem(id: string, updateDto: CreateCatererItemDto): Promise<import("./entities/caterer-menu.entity").CatererMenu>;
    deleteItem(id: string): Promise<void>;
}
