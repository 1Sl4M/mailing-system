import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn,
  JoinTable,
  ManyToMany, ManyToOne, OneToMany,
  OneToOne,
  PrimaryGeneratedColumn, Timestamp,
  Unique
} from "typeorm";
import { Groups } from "./groups.entity";
import { SentUsers } from "./sent_users.entity";
import { Country } from "./country.entity";
import { City } from "./city.entity";

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Column()
  visible: boolean;

  @ManyToOne(() => Country, country => country.users)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => City, city => city.users)
  @JoinColumn({name: 'city_id'})
  city: City;

  // @CreateDateColumn({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  // created_at: Date;

  @ManyToMany(() => Groups)
  @JoinTable({
    name: 'user_group',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'group_id',
      referencedColumnName: 'id',
    },

  })
  groups: Groups[];

  @OneToMany(() => SentUsers, sentUsers => sentUsers.users)
  @JoinColumn({ name: 'user_id' })
  sentUsers: SentUsers[];
}