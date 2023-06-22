import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm";
import { Users } from './users.entity';
import { City } from './city.entity';

@Entity({ name: 'countries' })
export class Country {
  @PrimaryGeneratedColumn()
  country_id: number;

  @Column()
  country_name: string;

  @OneToMany(() => Users, user => user.country)
  @JoinColumn({ name: 'country_id' })
  users: Users[];

  @OneToMany(() => City, city => city.country)
  @JoinColumn({ name: 'country_id' })
  cities: City[];
}
