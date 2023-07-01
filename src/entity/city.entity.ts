import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Country } from './country.entity';
import { Users } from "./users.entity";

@Entity({ name: 'cities' })
export class City {
  @PrimaryGeneratedColumn()
  city_id: number; // just id

  @Column()
  city_name: string; // just name

  @ManyToOne(() => Country, country => country.cities)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @OneToMany(() => Users, users => users.city)
  users: Users[];
}
