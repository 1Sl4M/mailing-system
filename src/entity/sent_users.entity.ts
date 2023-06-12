import { Column, Entity, ManyToOne } from "typeorm";
import { IsAlpha, MaxLength } from "class-validator";
import { Users } from "./users.entity";
import { Spam } from "./spam.entity";

@Entity({ name: 'sent_users' })
export class SentUsers {
  @Column()
  user_id: number;

  @Column()
  spam_id: number;

  @Column()
  @IsAlpha()
  @MaxLength(1)
  status_code: string;

  @ManyToOne(() => Users, users => users.id)
  users: Users;

  @ManyToOne(() => Spam, spam => spam.id)
  spam: Spam;
}
