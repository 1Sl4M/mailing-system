import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

  @Column()
  date_of_creation: Date;

  @ManyToMany(() => Groups)
  @JoinTable({
    name: 'users_and_groups', // Название таблицы, содержащей связи
    joinColumn: {
      name: 'user_id', // Название столбца с идентификатором пользователя
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'group_id', // Название столбца с идентификатором группы
      referencedColumnName: 'id',
    },
  })
  groups: Groups[];

  @OneToMany(() => SentUsers, sentUsers => sentUsers.user_id)
  sentUsers: SentUsers[];
}
