import { Column, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";
import { Spam } from "./spam.entity";

@Entity({ name: 'groups' })
export class Groups {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  date_of_creation: Date;

  @ManyToMany(() => Users, user => user.groups)
  users: Users[];

  @OneToMany(() => Spam, spam => spam.group)
  spam: Spam[];
}
