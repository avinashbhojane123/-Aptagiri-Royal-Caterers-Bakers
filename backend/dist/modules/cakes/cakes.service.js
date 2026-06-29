"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CakesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cake_entity_1 = require("./entities/cake.entity");
let CakesService = class CakesService {
    cakesRepository;
    constructor(cakesRepository) {
        this.cakesRepository = cakesRepository;
    }
    async onModuleInit() {
        const count = await this.cakesRepository.count();
        if (count === 0) {
            console.log('No cakes found in database. Seeding default catalog...');
            const defaultCakes = [
                {
                    name: 'Chocolate Fudge Decadence',
                    description: 'Rich triple-layer chocolate sponge smothered in velvety fudge icing. A chocolate lover’s ultimate dream.',
                    price: 24.99,
                    stock: 12,
                    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
                    flavor: 'Chocolate',
                    size: cake_entity_1.CakeSize.MEDIUM,
                },
                {
                    name: 'Red Velvet Classic',
                    description: 'Traditional light cocoa red velvet sponge topped with thick, luxurious vanilla cream cheese frosting.',
                    price: 28.5,
                    stock: 8,
                    imageUrl: 'https://images.unsplash.com/photo-1586985289688-ca9cf49d3ad0?w=600&auto=format&fit=crop&q=80',
                    flavor: 'Red Velvet',
                    size: cake_entity_1.CakeSize.MEDIUM,
                },
                {
                    name: 'Strawberry Fields Shortcake',
                    description: 'Light sponge cake layered with sweet vanilla whipped cream and fresh organic strawberries.',
                    price: 22.0,
                    stock: 15,
                    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop&q=80',
                    flavor: 'Strawberry',
                    size: cake_entity_1.CakeSize.SMALL,
                },
                {
                    name: 'Madagascar Vanilla Dream',
                    description: 'Elegant vanilla sponge flavored with genuine Madagascar vanilla beans and whipped buttercream.',
                    price: 19.99,
                    stock: 10,
                    imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=600&auto=format&fit=crop&q=80',
                    flavor: 'Vanilla',
                    size: cake_entity_1.CakeSize.MEDIUM,
                },
                {
                    name: 'Lemon Blueberry Zest',
                    description: 'Zesty double-layer lemon cake baked with fresh blueberries and topped with a sweet citrus glaze.',
                    price: 26.0,
                    stock: 5,
                    imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format&fit=crop&q=80',
                    flavor: 'Lemon',
                    size: cake_entity_1.CakeSize.LARGE,
                },
            ];
            for (const cake of defaultCakes) {
                await this.create(cake);
            }
            console.log('Database seeded with 5 default cakes.');
        }
    }
    async findAll(search, flavor, page = 1, limit = 9) {
        const where = {};
        if (search) {
            where.name = (0, typeorm_2.Like)(`%${search}%`);
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
    async findOne(id) {
        const cake = await this.cakesRepository.findOne({ where: { id } });
        if (!cake) {
            throw new common_1.NotFoundException(`Cake with ID ${id} not found`);
        }
        return cake;
    }
    async create(createCakeDto) {
        const cake = this.cakesRepository.create(createCakeDto);
        return this.cakesRepository.save(cake);
    }
    async update(id, updateCakeDto) {
        const cake = await this.findOne(id);
        Object.assign(cake, updateCakeDto);
        return this.cakesRepository.save(cake);
    }
    async remove(id) {
        const cake = await this.findOne(id);
        await this.cakesRepository.remove(cake);
    }
};
exports.CakesService = CakesService;
exports.CakesService = CakesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cake_entity_1.Cake)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CakesService);
//# sourceMappingURL=cakes.service.js.map