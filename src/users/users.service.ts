import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../entity/users.entity";
import { FindOneOptions, Repository } from "typeorm";
import { FilterDto } from "./dto/filter.dto";
import { Groups } from "../entity/groups.entity";
import { GroupsService } from "../groups/groups.service";
import { Country } from "../entity/country.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
    @InjectRepository(Groups) private readonly groupsRepository: Repository<Groups>,
    @InjectRepository(Country) private readonly countryRepository: Repository<Country>,
    private readonly groupsService: GroupsService
  ) {}

  async create(dto: CreateUserDto): Promise<Users> {
    const { email, country_id, city_id } = dto;
    const existingUser = await this.findByEmailForCreateUser(email);

    let newDate = new Date();

    if(!existingUser) {
      const query = `
        insert into users(name, surname, email, country_id, city_id, created_at, deleted) 
        values('${dto.name}', '${dto.surname}', '${dto.email}', ${country_id}, ${city_id}, '${newDate.toISOString()}', false)
      `;

      return this.usersRepository.query(query);
    } else {
      throw new Error('User with the same email already exists.');
    }
  }

  async getUsersWithFilters(dto: FilterDto): Promise<Users[]> {
    const { search } = dto;

    let users = await this.findAllUsers();

    if (search) {
      users = users.filter(user =>
        (user.id && user.id.toString().includes(search)) ||
        (user.name && user.name.includes(search)) ||
        (user.surname && user.surname.includes(search)) ||
        (user.email && user.email.includes(search))
      );
    }

    return users;
  }

  async findAllUsers():Promise<Users[]> {
    const query = `
    select users.id, users.name, users.surname, users.email, users.created_at, countries.country_name, cities.city_name, users.deleted from users 
    join countries on countries.country_id = users.country_id
    join cities on cities.city_id = users.city_id
    order by id
    `;

    return this.usersRepository.query(query);
  }

  async findByEmailForSendMessage(email: string): Promise<Users> {
    const user = await this.usersRepository.findOneBy({ email });

    if(!user) {
      throw new NotFoundException('Email not found');
    }

    return user;
  }

  async findByEmailForCreateUser(email: string): Promise<Users | string> {
    const user = await this.usersRepository.findOneBy({ email: email });

    return user;
  }

  async getUsersStatusCode(groupId: number, letterId: number) {
    const query = `
    select users.id, users.name, users.email, user_email_history.status_code from user_email_history
    join users on users.id = user_email_history.user_id
    join spams ON spams.id = user_email_history.spam_id
    join groups on groups.id = spams.group_id
    join letters on letters.id = spams.letter_id
    where groups.id = ${groupId} and letters.id = ${letterId}
    `;

    return this.usersRepository.query(query);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({id});

    if(!user) {
      throw new NotFoundException('User not found');
    }

    const query = `
    update users set 
        name = '${updateUserDto.name}',
        surname = '${updateUserDto.surname}' ,
        email = '${updateUserDto.email}' ,
        country_id = ${updateUserDto.country_id} ,
        city_id = ${updateUserDto.city_id}
    where id = ${id}
    `;

    return this.usersRepository.query(query);
  }

  async remove(userId: number) {
    const user = await this.usersRepository.findOneBy({id: userId});

    if(!user) {
      throw new NotFoundException('User not found');
    }

    await this.groupsService.removeUserFromAllGroups(userId);

    user.deleted = true;

    await this.usersRepository.save(user);
  }

  async getUserWithGroups(userId: number): Promise<{ name: string; groups: string; email: string }> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const query = `
      SELECT group_id FROM user_group
      WHERE user_id = ${userId}
    `;

    const group = await this.groupsRepository.query(query);

    return {
      name: user.name,
      email: user.email,
      groups: group,
    };
  }
}
