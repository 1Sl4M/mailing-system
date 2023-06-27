import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Country } from './country.entity';
import { Users } from "./users.entity";

@Entity({ name: 'cities' })
export class City {
  @PrimaryGeneratedColumn()
  city_id: number;

  @Column()
  city_name: string;

  @ManyToOne(() => Country, country => country.cities)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @OneToMany(() => Users, users => users.city)
  users: Users[];
}
