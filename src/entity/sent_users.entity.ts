import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { IsAlpha, MaxLength } from "class-validator";
import { Users } from "./users.entity";
import { Spam } from "./spam.entity";

@Entity({ name: 'sent_users' })
export class SentUsers {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  spam_id: number;

  @Column()
  @IsAlpha()
  @MaxLength(1)
  status_code: string;

  @ManyToOne(() => Users, users => users.id)
  @JoinColumn({ name: 'user_id' })
  users: Users;

  @OneToOne(() => Spam, spam => spam.id)
  @JoinColumn({ name: 'spam_id' })
  spam: Spam;
}
