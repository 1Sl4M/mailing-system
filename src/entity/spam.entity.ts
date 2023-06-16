import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany, OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { IsAlpha, MaxLength } from "class-validator";
import { Groups } from "./groups.entity";
import { Letters } from "./letters.entity";
import { SentUsers } from "./sent_users.entity";

@Entity({ name: 'spam' })
export class Spam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  group_id: number;

  @Column()
  letter_id: number;

  @Column()
  @IsAlpha()
  @MaxLength(1)
  status_code: string;

  @OneToOne(() => Groups, group => group.spam)
  @JoinColumn({ name: "group_id" })
  group: Groups;

  @ManyToOne(() => Letters, letter => letter.spam)
  @JoinColumn({ name: "letter_id" })
  letter: Letters;

  @OneToOne(() => SentUsers, sentUsers => sentUsers.spam_id)
  sentUsers: SentUsers;
}
