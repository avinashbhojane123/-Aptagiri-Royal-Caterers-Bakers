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
exports.CaterersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const caterer_menu_entity_1 = require("./entities/caterer-menu.entity");
let CaterersService = class CaterersService {
    catererRepository;
    constructor(catererRepository) {
        this.catererRepository = catererRepository;
    }
    async onModuleInit() {
        const count = await this.catererRepository.count();
        if (count === 0) {
            console.log('No catering items found. Seeding Royal Caterers menu...');
            const defaultItems = [
                {
                    category: 'Welcome Drinks',
                    items: [
                        {
                            name: 'Lemon mint',
                            price: 2.99,
                            desc: 'Chilled refreshing lemon juice with crushed fresh mint leaves.',
                        },
                        {
                            name: 'Lemon ginger',
                            price: 2.99,
                            desc: 'Refreshing lemon juice base with a spicy kick of ginger.',
                        },
                        {
                            name: 'Fruit mocktail',
                            price: 4.5,
                            desc: 'Blend of seasonal fresh fruit juices, syrups, and soda.',
                        },
                        {
                            name: 'Kokam',
                            price: 3.2,
                            desc: 'Sweet and tangy traditional digestif drink made from kokum extract.',
                        },
                        {
                            name: 'Pineapple Juice',
                            price: 3.5,
                            desc: 'Freshly squeezed sweet and sour pineapple juice.',
                        },
                        {
                            name: 'Blueberry Juice',
                            price: 4.5,
                            desc: 'Chilled wild blueberry juice rich in antioxidants.',
                        },
                        {
                            name: 'Blue Curaco',
                            price: 3.99,
                            desc: 'Vibrant blue mocktail with citrus orange flavor and sparkling soda.',
                        },
                        {
                            name: 'Watermelon Juice',
                            price: 3.5,
                            desc: 'Freshly blended hydrating red watermelon juice.',
                        },
                        {
                            name: 'Soft drinks (Mirinda/Pepsi/Coke)',
                            price: 1.99,
                            desc: 'Assorted aerated soft drinks.',
                        },
                        {
                            name: 'Tea',
                            price: 1.5,
                            desc: 'Traditional hot brewed milk tea with spices.',
                        },
                        {
                            name: 'Coffee',
                            price: 1.99,
                            desc: 'Classic hot brewed milk coffee.',
                        },
                    ],
                },
                {
                    category: 'Veg Starters',
                    items: [
                        {
                            name: 'Gobi Manchurian',
                            price: 6.99,
                            desc: 'Crispy fried cauliflower florets tossed in a sweet, tangy, and spicy Manchurian sauce.',
                        },
                        {
                            name: 'Gobi chilli',
                            price: 6.99,
                            desc: 'Deep-fried cauliflower tossed with chillies, bell peppers, and soy sauce.',
                        },
                        {
                            name: 'Gobi 65',
                            price: 6.99,
                            desc: 'Spiced and deep-fried crispy cauliflower starter marinated in southern spices.',
                        },
                        {
                            name: 'Baby Corn Manchurian',
                            price: 7.2,
                            desc: 'Crispy baby corn stir-fried in thick Chinese Manchurian gravy.',
                        },
                        {
                            name: 'Baby corn chilli',
                            price: 7.2,
                            desc: 'Deep-fried baby corn tossed with fresh green chillies and soy glaze.',
                        },
                        {
                            name: 'Hakka Noodles',
                            price: 6.5,
                            desc: 'Stir-fried noodles tossed with fresh garden vegetables and mild soy sauce.',
                        },
                        {
                            name: 'Vegetable Manchurian',
                            price: 6.99,
                            desc: 'Deep-fried mixed vegetable balls in a rich sweet-and-sour Chinese sauce.',
                        },
                        {
                            name: 'Mushroom Manchurian',
                            price: 7.5,
                            desc: 'Golden-fried fresh button mushrooms coated in Manchurian sauce.',
                        },
                        {
                            name: 'Hara bhara kebab',
                            price: 7.5,
                            desc: 'Healthy pan-fried patties made of green peas, spinach, potatoes, and spices.',
                        },
                        {
                            name: 'Paneer chilli',
                            price: 8.5,
                            desc: 'Fried cottage cheese cubes tossed with bell peppers, onions, and hot green chillies.',
                        },
                        {
                            name: 'Paneer tikka',
                            price: 8.99,
                            desc: 'Cottage cheese cubes marinated in spiced yogurt and grilled in a clay tandoor oven.',
                        },
                        {
                            name: 'Paneer Pakora',
                            price: 7.99,
                            desc: 'Deep-fried spiced batter-coated cottage cheese fritters.',
                        },
                        {
                            name: 'Aloo kebab',
                            price: 6.5,
                            desc: 'Minced potato patties flavored with traditional Indian herbs and pan-seared.',
                        },
                        {
                            name: 'Aloo Tikki',
                            price: 5.99,
                            desc: 'Crispy fried potato patties served with sweet and sour chutneys.',
                        },
                        {
                            name: 'Mini samosa',
                            price: 4.99,
                            desc: 'Golden flaky pastry cones stuffed with spiced potatoes and peas.',
                        },
                        {
                            name: 'Veg Roll',
                            price: 5.99,
                            desc: 'Flatbread wrap stuffed with sautéed seasonal fresh vegetables.',
                        },
                        {
                            name: 'Schezwan Roll',
                            price: 6.2,
                            desc: 'Wrap filled with sautéed veggies tossed in a spicy, fiery Schezwan dressing.',
                        },
                        {
                            name: 'Pani puri',
                            price: 4.5,
                            desc: 'Hollow crispy puris filled with spiced potatoes, sweet chutney, and spiced mint water.',
                        },
                        {
                            name: 'Shev Puri',
                            price: 4.99,
                            desc: 'Puris topped with potatoes, onions, chutneys, and a generous layer of sev.',
                        },
                        {
                            name: 'Dhahi Puri',
                            price: 5.5,
                            desc: 'Puris loaded with potatoes, sweetened yogurt, chutneys, and fine sev.',
                        },
                        {
                            name: 'Masala Papad',
                            price: 2.5,
                            desc: 'Roasted crispy papad topped with chopped onions, tomatoes, coriander, and chat masala.',
                        },
                        {
                            name: 'Finger chips',
                            price: 3.5,
                            desc: 'Crispy golden-fried classic potato french fries.',
                        },
                        {
                            name: 'Veg Lollipop',
                            price: 6.99,
                            desc: 'Deep-fried vegetable balls served on a stick with a sweet-and-sour glaze.',
                        },
                    ],
                },
                {
                    category: 'Veg Soups',
                    items: [
                        {
                            name: 'Tomato soup',
                            price: 3.99,
                            desc: 'Creamy, rich hot tomato soup served with crispy bread croutons.',
                        },
                        {
                            name: 'Babycorn soup',
                            price: 4.2,
                            desc: 'Clear vegetable broth containing fresh baby corn slices.',
                        },
                        {
                            name: 'Mixed veg soup',
                            price: 3.99,
                            desc: 'Healthy clear soup loaded with assorted seasonal fresh vegetables.',
                        },
                        {
                            name: 'Manchurian soup',
                            price: 4.5,
                            desc: 'Spicy and tangy dark vegetable soup topped with fried noodles.',
                        },
                        {
                            name: 'Lemon coriander soup',
                            price: 4.5,
                            desc: 'Clear vegetable soup flavored with fresh lemon juice and fresh coriander leaves.',
                        },
                        {
                            name: 'Rasam',
                            price: 2.99,
                            desc: 'Tangy, spicy south Indian traditional soup made of tamarind, tomatoes, and pepper.',
                        },
                    ],
                },
                {
                    category: 'Indian Bread',
                    items: [
                        {
                            name: 'Poori',
                            price: 2.99,
                            desc: 'Deep-fried puffed whole wheat bread.',
                        },
                        {
                            name: 'Chapathi',
                            price: 1.5,
                            desc: 'Soft unleavened flatbread cooked on a griddle.',
                        },
                        {
                            name: 'Rumali Roti',
                            price: 2.99,
                            desc: 'Extremely thin, large soft flatbread cooked on an inverted tawa.',
                        },
                        {
                            name: 'Masala Roti',
                            price: 2.5,
                            desc: 'Spiced wheat flatbread cooked with herbs.',
                        },
                        {
                            name: 'Tandoori Naan',
                            price: 2.5,
                            desc: 'Traditional leavened flatbread baked in a tandoor oven.',
                        },
                        {
                            name: 'Butter naan',
                            price: 2.99,
                            desc: 'Soft leavened naan brushed generously with fresh butter.',
                        },
                        {
                            name: 'Garlic naan',
                            price: 3.5,
                            desc: 'Leavened flatbread topped with minced garlic and butter.',
                        },
                        {
                            name: 'Paneer/Onion kulcha',
                            price: 3.99,
                            desc: 'Puffed flatbread stuffed with spiced cottage cheese or onions.',
                        },
                        {
                            name: 'Tandoori roti',
                            price: 1.99,
                            desc: 'Whole wheat flatbread baked in a tandoor clay oven.',
                        },
                    ],
                },
                {
                    category: 'Main Course',
                    items: [
                        {
                            name: 'Paneer butter masala',
                            price: 10.99,
                            desc: 'Rich and creamy curry made with cottage cheese, tomatoes, butter, and cashew paste.',
                        },
                        {
                            name: 'Kadai paneer',
                            price: 10.99,
                            desc: 'Cottage cheese cooked with bell peppers and freshly ground spices in a wok.',
                        },
                        {
                            name: 'Paneer bahari',
                            price: 11.5,
                            desc: 'Chef special recipe of paneer cooked in a green mint and spinach gravy.',
                        },
                        {
                            name: 'Mix Veg curry',
                            price: 8.99,
                            desc: 'Assorted seasonal vegetables cooked in a rich onion-tomato gravy.',
                        },
                        {
                            name: 'Paneer Tikka Masala',
                            price: 11.99,
                            desc: 'Grilled paneer cubes cooked in a spicy, rich masala gravy.',
                        },
                        {
                            name: 'Channa Masala',
                            price: 8.5,
                            desc: 'Spicy chickpeas cooked in a traditional onion-tomato gravy.',
                        },
                        {
                            name: 'Paneer Kurma',
                            price: 10.5,
                            desc: 'Paneer cubes cooked in a coconut and yogurt based creamy korma gravy.',
                        },
                        {
                            name: 'Kadai Sabji',
                            price: 8.99,
                            desc: 'Mixed vegetables stir-fried with hot spices in a wok.',
                        },
                        {
                            name: 'Malai kofta',
                            price: 11.99,
                            desc: 'Deep-fried cottage cheese and potato balls in a rich, sweet cashew gravy.',
                        },
                        {
                            name: 'Green Peas Masala',
                            price: 8.5,
                            desc: 'Fresh green peas cooked in a spiced tomato gravy.',
                        },
                        {
                            name: 'Aloo Gobhi Matar',
                            price: 8.99,
                            desc: 'Classic dry combination of potatoes, cauliflower florets, and green peas.',
                        },
                        {
                            name: 'Bhindi Masala',
                            price: 8.99,
                            desc: 'Okra sautéed with onions, tomatoes, and dry spices.',
                        },
                        {
                            name: 'Palak Paneer',
                            price: 10.99,
                            desc: 'Paneer cubes cooked in a thick paste of spiced spinach gravy.',
                        },
                        {
                            name: 'Matar Paneer',
                            price: 10.5,
                            desc: 'Cottage cheese and green peas simmered in a spiced tomato gravy.',
                        },
                        {
                            name: 'Chole',
                            price: 8.5,
                            desc: 'Rich and aromatic North Indian chickpea curry.',
                        },
                        {
                            name: 'Veg kolhapuri',
                            price: 9.5,
                            desc: 'Fiery, spicy mixed vegetable curry hailing from Kolhapur.',
                        },
                        {
                            name: 'Akka masur',
                            price: 8.5,
                            desc: 'Whole black lentils cooked in a spicy Kolhapuri style gravy.',
                        },
                        {
                            name: 'Mataki',
                            price: 7.99,
                            desc: 'Sprouted moth beans cooked with traditional spices.',
                        },
                        {
                            name: 'Methi malai matar',
                            price: 10.5,
                            desc: 'Creamy sweet curry made with fenugreek leaves, green peas, and fresh cream.',
                        },
                        {
                            name: 'Shimla potato',
                            price: 8.5,
                            desc: 'Sautéed potatoes and bell peppers tossed with dry spices.',
                        },
                        {
                            name: 'Dhal fry',
                            price: 7.5,
                            desc: 'Yellow lentils tempered with butter, cumin, garlic, and onions.',
                        },
                        {
                            name: 'Dhal makhni',
                            price: 9.5,
                            desc: 'Slow-cooked whole black lentils and kidney beans with cream and butter.',
                        },
                        {
                            name: 'Rajma',
                            price: 8.5,
                            desc: 'Red kidney beans cooked in a thick gravy with North Indian spices.',
                        },
                        {
                            name: 'Dhal palak',
                            price: 7.99,
                            desc: 'Yellow lentils cooked together with fresh chopped spinach leaves.',
                        },
                        {
                            name: 'Dhal Tadka',
                            price: 7.99,
                            desc: 'Smooth yellow lentils tempered with hot ghee, dry red chillies, and garlic.',
                        },
                        {
                            name: 'Methi dhal',
                            price: 7.99,
                            desc: 'Lentils cooked with fresh bitter fenugreek leaves.',
                        },
                        {
                            name: 'Tomato dhal',
                            price: 7.5,
                            desc: 'Yellow lentils cooked with tangy tomatoes and spices.',
                        },
                    ],
                },
                {
                    category: 'Flavoured Rice',
                    items: [
                        {
                            name: 'White Rice',
                            price: 3.5,
                            desc: 'Steamed premium long-grain Basmati rice.',
                        },
                        {
                            name: 'Masala Rice',
                            price: 5.5,
                            desc: 'Rice cooked with whole aromatic spices and vegetable stock.',
                        },
                        {
                            name: 'Ghee Rice',
                            price: 6.5,
                            desc: 'Fragrant Basmati rice sautéed in pure ghee and topped with cashews.',
                        },
                        {
                            name: 'Jeera rice',
                            price: 5.5,
                            desc: 'Basmati rice tempered with ghee and cumin seeds.',
                        },
                        {
                            name: 'Fried Rice',
                            price: 7.5,
                            desc: 'Stir-fried rice cooked with finely chopped vegetables and soy sauce.',
                        },
                        {
                            name: 'Veg Biriyani',
                            price: 9.5,
                            desc: 'Layered aromatic Basmati rice and spiced vegetables cooked on dum.',
                        },
                        {
                            name: 'Veg Pulav',
                            price: 8.5,
                            desc: 'One-pot rice dish cooked with mixed vegetables and mild spices.',
                        },
                        {
                            name: 'Peas Pulav',
                            price: 7.99,
                            desc: 'Basmati rice cooked with sweet green peas and whole spices.',
                        },
                        {
                            name: 'Palak pulav',
                            price: 8.2,
                            desc: 'Healthy green rice cooked with fresh spinach puree and spices.',
                        },
                    ],
                },
                {
                    category: 'Desserts',
                    items: [
                        {
                            name: 'Gulab Jamoon',
                            price: 3.99,
                            desc: 'Soft milk-solid balls deep-fried and soaked in sweet cardamom sugar syrup.',
                        },
                        {
                            name: 'Dry Jamoon',
                            price: 3.99,
                            desc: 'Fried milk-solid balls rolled in dry sugar crystals.',
                        },
                        {
                            name: 'Kala jamoon',
                            price: 4.2,
                            desc: 'Milk-solid balls fried to a deep black color and soaked in syrup.',
                        },
                        {
                            name: 'Gaajar ka Halwa',
                            price: 4.99,
                            desc: 'Traditional pudding made with grated carrots, milk, sugar, and ghee.',
                        },
                        {
                            name: 'Vanilla Ice Cream',
                            price: 2.99,
                            desc: 'Classic creamy vanilla flavored ice cream.',
                        },
                        {
                            name: 'Chocolate Ice Cream',
                            price: 2.99,
                            desc: 'Rich creamy chocolate flavored ice cream.',
                        },
                        {
                            name: 'Butterscotch Ice Cream',
                            price: 3.2,
                            desc: 'Creamy ice cream loaded with sweet butterscotch crunch.',
                        },
                        {
                            name: 'Cold coffee with ice cream',
                            price: 4.5,
                            desc: 'Chilled whipped coffee served with a scoop of vanilla ice cream.',
                        },
                        {
                            name: 'Jalebi',
                            price: 3.99,
                            desc: 'Crispy deep-fried spiral batter soaked in saffron sugar syrup.',
                        },
                        {
                            name: 'Bombay Halwa',
                            price: 3.5,
                            desc: 'Chewy cornflour-based sweet flavored with cardamom and loaded with nuts.',
                        },
                        {
                            name: 'Besan ka Laddu',
                            price: 3.99,
                            desc: 'Sweet round balls made of roasted chickpea flour, ghee, and sugar.',
                        },
                        {
                            name: 'Mung Dal Halwa',
                            price: 4.99,
                            desc: 'Rich and heavy sweet made of split yellow lentils, ghee, and sugar.',
                        },
                        {
                            name: 'Boondi',
                            price: 2.99,
                            desc: 'Tiny sweet fried gram flour droplets soaked in sugar syrup.',
                        },
                        {
                            name: 'Milk kheer',
                            price: 3.99,
                            desc: 'Traditional rice pudding cooked with condensed milk and nuts.',
                        },
                        {
                            name: 'Sabudana kheer',
                            price: 3.99,
                            desc: 'Sweet pudding made with tapioca pearls, milk, and sugar.',
                        },
                        {
                            name: 'Jack fruit kheer',
                            price: 4.5,
                            desc: 'South Indian style payasam cooked with sweet ripe jackfruit pieces.',
                        },
                        {
                            name: 'Rava kheer',
                            price: 3.5,
                            desc: 'Quick sweet pudding made of semolina, milk, and cardamom.',
                        },
                        {
                            name: 'Fruit salad',
                            price: 4.2,
                            desc: 'Bowl of assorted fresh seasonal fruits diced and mixed.',
                        },
                        {
                            name: 'Fruit custard',
                            price: 4.5,
                            desc: 'Chilled creamy milk custard layered with fresh cut fruits.',
                        },
                        {
                            name: 'Madhur Mila milan',
                            price: 4.99,
                            desc: 'Chef special dessert combining layered sweets and rabdi.',
                        },
                        {
                            name: 'Shahi tukada',
                            price: 4.5,
                            desc: 'Fried bread slices soaked in milk rabri and cardamon syrup.',
                        },
                        {
                            name: 'Kaju katli',
                            price: 5.5,
                            desc: 'Traditional diamond-shaped sweet cashew fudge fudge.',
                        },
                        {
                            name: 'Rasgulla',
                            price: 3.99,
                            desc: 'Spongy white cottage cheese balls cooked in clear sugar syrup.',
                        },
                        {
                            name: 'Rasmalai',
                            price: 4.99,
                            desc: 'Flattened paneer discs soaked in thickened, sweetened saffron milk.',
                        },
                        {
                            name: 'Khaja',
                            price: 3.5,
                            desc: 'Layered crispy fried pastry sweets soaked in sugar syrup.',
                        },
                        {
                            name: 'Basundi',
                            price: 4.5,
                            desc: 'Sweet thickened condensed milk flavored with nutmeg and cardamom.',
                        },
                        {
                            name: 'Shrikhand',
                            price: 3.99,
                            desc: 'Creamy yogurt dessert flavored with cardamom and saffron.',
                        },
                        {
                            name: 'Fruit khand',
                            price: 4.5,
                            desc: 'Creamy strained yogurt blend flavored with fresh fruit pulps.',
                        },
                        {
                            name: 'Modak',
                            price: 3.99,
                            desc: 'Sweet steamed dumplings filled with coconut and jaggery.',
                        },
                    ],
                },
            ];
            for (const catGroup of defaultItems) {
                for (const item of catGroup.items) {
                    const newItem = this.catererRepository.create({
                        category: catGroup.category,
                        itemName: item.name,
                        description: item.desc,
                        price: item.price,
                        imageUrl: this.getImageUrlForCatererItem(item.name, catGroup.category),
                    });
                    await this.catererRepository.save(newItem);
                }
            }
            console.log('Seeded Royal Caterers menu with 120+ items.');
        }
        else {
            console.log('Catering items exist. Ensuring all items have valid imageUrl...');
            const existingItems = await this.catererRepository.find();
            let updatedCount = 0;
            for (const item of existingItems) {
                if (!item.imageUrl) {
                    item.imageUrl = this.getImageUrlForCatererItem(item.itemName, item.category);
                    await this.catererRepository.save(item);
                    updatedCount++;
                }
            }
            if (updatedCount > 0) {
                console.log(`Updated ${updatedCount} existing catering items with image URLs.`);
            }
        }
    }
    getImageUrlForCatererItem(name, category) {
        const itemNameLower = name.toLowerCase();
        if (itemNameLower.includes('lemon mint') ||
            itemNameLower.includes('mint')) {
            return 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80';
        }
        if (itemNameLower.includes('lemon ginger') ||
            itemNameLower.includes('ginger')) {
            return 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80';
        }
        if (itemNameLower.includes('mocktail') ||
            itemNameLower.includes('blue curaco') ||
            itemNameLower.includes('blue')) {
            return 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&auto=format&fit=crop&q=80';
        }
        if (itemNameLower.includes('pineapple')) {
            return 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&auto=format&fit=crop&q=80';
        }
        if (itemNameLower.includes('blueberry')) {
            return 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&auto=format&fit=crop&q=80';
        }
        if (itemNameLower.includes('watermelon')) {
            return 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80';
        }
        if (itemNameLower.includes('tea')) {
            return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80';
        }
        if (itemNameLower.includes('coffee')) {
            return 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80';
        }
        if (itemNameLower.includes('kokam') ||
            itemNameLower.includes('drink') ||
            itemNameLower.includes('juice') ||
            category === 'Welcome Drinks') {
            return 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80';
        }
        if (itemNameLower.includes('manchurian') ||
            itemNameLower.includes('chilli') ||
            itemNameLower.includes('noodle') ||
            itemNameLower.includes('lollipop')) {
            return 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80';
        }
        if (itemNameLower.includes('paneer tikka') ||
            itemNameLower.includes('tikka') ||
            itemNameLower.includes('kebab')) {
            return 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=80';
        }
        if (itemNameLower.includes('paneer pakora') ||
            itemNameLower.includes('pakora') ||
            itemNameLower.includes('samosa') ||
            itemNameLower.includes('roll')) {
            return 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80';
        }
        if (itemNameLower.includes('puri') ||
            itemNameLower.includes('tikki') ||
            itemNameLower.includes('papad') ||
            itemNameLower.includes('chips')) {
            return 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80';
        }
        if (category === 'Veg Soups' ||
            itemNameLower.includes('soup') ||
            itemNameLower.includes('rasam')) {
            return 'https://images.unsplash.com/photo-1547592165-e1d17fed6006?w=600&auto=format&fit=crop&q=80';
        }
        if (category === 'Indian Bread' ||
            itemNameLower.includes('naan') ||
            itemNameLower.includes('roti') ||
            itemNameLower.includes('chapathi') ||
            itemNameLower.includes('kulcha') ||
            itemNameLower.includes('poori')) {
            return 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80';
        }
        if (itemNameLower.includes('paneer') && category === 'Main Course') {
            return 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80';
        }
        if (itemNameLower.includes('dal') ||
            itemNameLower.includes('dhal') ||
            itemNameLower.includes('chole') ||
            itemNameLower.includes('channa') ||
            itemNameLower.includes('rajma')) {
            return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80';
        }
        if (category === 'Main Course' ||
            itemNameLower.includes('curry') ||
            itemNameLower.includes('masala') ||
            itemNameLower.includes('sabji') ||
            itemNameLower.includes('kofta') ||
            itemNameLower.includes('bhindi') ||
            itemNameLower.includes('aloo')) {
            return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80';
        }
        if (category === 'Flavoured Rice' ||
            itemNameLower.includes('rice') ||
            itemNameLower.includes('biriyani') ||
            itemNameLower.includes('pulav') ||
            itemNameLower.includes('pulao')) {
            return 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80';
        }
        if (itemNameLower.includes('ice cream') ||
            itemNameLower.includes('cold coffee')) {
            return 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&auto=format&fit=crop&q=80';
        }
        if (category === 'Desserts' ||
            itemNameLower.includes('jamoon') ||
            itemNameLower.includes('halwa') ||
            itemNameLower.includes('jalebi') ||
            itemNameLower.includes('laddu') ||
            itemNameLower.includes('sweet') ||
            itemNameLower.includes('kheer') ||
            itemNameLower.includes('katli') ||
            itemNameLower.includes('rasgulla') ||
            itemNameLower.includes('rasmalai') ||
            itemNameLower.includes('basundi') ||
            itemNameLower.includes('shrikhand') ||
            itemNameLower.includes('modak')) {
            return 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80';
        }
        return 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=80';
    }
    async getMenu() {
        return this.catererRepository.find({
            order: { category: 'ASC', itemName: 'ASC' },
        });
    }
    async getMenuByCategory(category) {
        return this.catererRepository.find({
            where: { category },
            order: { itemName: 'ASC' },
        });
    }
    async findOne(id) {
        const item = await this.catererRepository.findOne({ where: { id } });
        if (!item) {
            throw new common_1.NotFoundException(`Caterer menu item with ID ${id} not found`);
        }
        return item;
    }
    async addItem(createDto) {
        const item = this.catererRepository.create(createDto);
        return this.catererRepository.save(item);
    }
    async updateItem(id, updateDto) {
        const item = await this.findOne(id);
        Object.assign(item, updateDto);
        return this.catererRepository.save(item);
    }
    async deleteItem(id) {
        const item = await this.findOne(id);
        await this.catererRepository.remove(item);
    }
};
exports.CaterersService = CaterersService;
exports.CaterersService = CaterersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(caterer_menu_entity_1.CatererMenu)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CaterersService);
//# sourceMappingURL=caterers.service.js.map