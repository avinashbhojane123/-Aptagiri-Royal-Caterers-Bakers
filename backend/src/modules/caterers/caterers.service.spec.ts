import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CaterersService } from './caterers.service';
import { CatererMenu } from './entities/caterer-menu.entity';

describe('CaterersService', () => {
  let service: CaterersService;

  const mockCatererRepository = {
    count: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaterersService,
        {
          provide: getRepositoryToken(CatererMenu),
          useValue: mockCatererRepository,
        },
      ],
    }).compile();

    service = module.get<CaterersService>(CaterersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getImageUrlForCatererItem', () => {
    it('should map welcome drinks correctly', () => {
      const lemonMintUrl = service.getImageUrlForCatererItem(
        'Lemon Mint Cooler',
        'Welcome Drinks',
      );
      expect(lemonMintUrl).toContain('photo-1513558161293-cdaf765ed2fd');

      const coffeeUrl = service.getImageUrlForCatererItem(
        'Hot Filter Coffee',
        'Welcome Drinks',
      );
      expect(coffeeUrl).toContain('photo-1509042239860-f550ce710b93');
    });

    it('should map veg starters correctly', () => {
      const manchurianUrl = service.getImageUrlForCatererItem(
        'Gobi Manchurian Dry',
        'Veg Starters',
      );
      expect(manchurianUrl).toContain('photo-1585032226651-759b368d7246');

      const samosaUrl = service.getImageUrlForCatererItem(
        'Mini Punjabi Samosa',
        'Veg Starters',
      );
      expect(samosaUrl).toContain('photo-1601050690597-df056fb4ce78');
    });

    it('should map main courses correctly', () => {
      const paneerUrl = service.getImageUrlForCatererItem(
        'Paneer Butter Masala',
        'Main Course',
      );
      expect(paneerUrl).toContain('photo-1631452180519-c014fe946bc7');

      const dalUrl = service.getImageUrlForCatererItem(
        'Dal Tadka Double',
        'Main Course',
      );
      expect(dalUrl).toContain('photo-1546833999-b9f581a1996d');
    });

    it('should fallback to default for unknown names', () => {
      const defaultUrl = service.getImageUrlForCatererItem(
        'Unique Unknown Special Item Name',
        'Unknown Category',
      );
      expect(defaultUrl).toBe(
        'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=80',
      );
    });
  });

  describe('findOne', () => {
    it('should return item if found', async () => {
      const mockItem = {
        id: 'uuid-1',
        itemName: 'Lemon mint',
        category: 'Welcome Drinks',
      };
      mockCatererRepository.findOne.mockResolvedValue(mockItem);

      const result = await service.findOne('uuid-1');
      expect(result).toEqual(mockItem);
    });

    it('should throw NotFoundException if not found', async () => {
      mockCatererRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('uuid-2')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
