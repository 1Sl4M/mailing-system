import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./users.entity";
import { Spam } from "./spam.entity";
import 'reflect-metadata';

@Entity({ name: 'groups' })
export class Groups {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  // @CreateDateColumn()
  // createdgroupat: Date;

  @ManyToMany(() => Users, user => user.groups)
  users: Users[];

  @OneToOne(() => Spam, spam => spam.group)
  spam: Spam;
}
