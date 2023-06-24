import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn,
  JoinTable,
  ManyToMany, ManyToOne, OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";
import { Groups } from "./groups.entity";
import { SentUsers } from "./sent_users.entity";
import { Country } from "./country.entity";

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

  @ManyToOne(() => Country, country => country.users)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column()
  city: string;

  // @CreateDateColumn()
  // createdAt: Date;

  @ManyToMany(() => Groups)
  @JoinTable({
    name: 'users_and_groups',
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