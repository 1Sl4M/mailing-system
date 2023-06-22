import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Users } from './users.entity';
import { City } from './city.entity';

@Entity({ name: 'countries' })
export class Country {
  @PrimaryGeneratedColumn()
  country_id: number;

  @Column()
  country_name: string;

  @OneToMany(() => Users, user => user.country)
  users: Users[];

  @OneToMany(() => City, city => city.country)
  cities: City[];
}
