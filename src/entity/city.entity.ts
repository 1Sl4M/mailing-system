import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Country } from './country.entity';

@Entity({ name: 'cities' })
export class City {
  @PrimaryGeneratedColumn()
  city_id: number;

  @Column()
  city_name: string;

  @ManyToOne(() => Country, country => country.cities)
  country: Country;
}
