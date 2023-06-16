import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";
import { Groups } from "./groups.entity";
import { SentUsers } from "./sent_users.entity";

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  otchestvo: string;

  @Column()
  email: string;

  @Column()
  country: string;

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

  @OneToOne(() => SentUsers, sentUsers => sentUsers.user_id)
  sentUsers: SentUsers;
}