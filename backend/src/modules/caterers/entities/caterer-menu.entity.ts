import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('caterer_menu')
export class CatererMenu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  category: string; // e.g., Welcome Drinks, Veg Starters, Veg Soups, Indian Bread, Main Course, Flavoured Rice, Desserts

  @Column()
  itemName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number; // Optional pricing field

  @Column({ type: 'text', nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}
