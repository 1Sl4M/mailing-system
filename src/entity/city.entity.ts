import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Country } from './country.entity';

@Entity({ name: 'cities' })
export class City {
  @PrimaryGeneratedColumn()
  city_id: number;

  @Column()
  city_name: string;

  @ManyToOne(() => Country, country => country.cities)
  @JoinColumn({ name: 'country_id' })
  country: Country;
}
