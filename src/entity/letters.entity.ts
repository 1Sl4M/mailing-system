import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";
import { Spam } from "./spam.entity";

@Entity({ name: 'letters' })
export class Letters {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  theme: string;

  @Column()
  content: string;

  @OneToMany(() => Spam, spam => spam.letter)
  @JoinColumn({ name: 'id' })
  spam: Spam;
}
