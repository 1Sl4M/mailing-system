import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { IsAlpha, MaxLength } from "class-validator";
import { Users } from "./users.entity";
import { Spam } from "./spam.entity";

@Entity({ name: 'user_email_history' })
export class SentUsers {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  spam_id: number;

  @Column()
  status_code: string;

  @ManyToOne(() => Users, user => user)
  @JoinColumn({ name: 'user_id' })
  users: Users;

  @OneToOne(() => Spam, spam => spam.sentUsers)
  @JoinColumn({ name: "spam_id" })
  spam: Spam;
}
