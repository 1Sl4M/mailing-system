import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../entity/users.entity";
import { FindOneOptions, Repository } from "typeorm";
import { FilterDto } from "./dto/filter.dto";
import { Groups } from "../entity/groups.entity";
import { GroupsService } from "../groups/groups.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
    @InjectRepository(Groups) private readonly groupsRepository: Repository<Groups>,
    private readonly groupsService: GroupsService
  ) {}

  async create(dto: CreateUserDto): Promise<Users> {
    const { email } = dto;
    const existingUser = await this.findByEmailForSendMessage(email);

    if(!existingUser) {
      const user = new Users();
      user.name = dto.name;
      user.surname = dto.surname;
      user.otchestvo = dto.otchestvo;
      user.email = dto.email;
      user.country = dto.country;

      return this.usersRepository.save(user);
    }
  }

  async createCity(city: string, id: number) {
    const user = await this.usersRepository.findOneBy({ id: id });

    if(user.city) {
      const query = `
      update users
      set city = $1
      where id = $2
      `;

      await this.usersRepository.query(query, [city, id]);

      return;
    }
    user.city = city;

    await this.usersRepository.save(user);

    return {
      msg: 'User updated successfully'
    }
  }

  async getUsersWithFilters(dto: FilterDto): Promise<Users[]> {
    const { search } = dto;

    let users = await this.findAll();

    if (search) {
      users = users.filter(user =>
        (user.id && user.id.toString().includes(search)) ||
        (user.name && user.name.includes(search)) ||
        (user.surname && user.surname.includes(search)) ||
        (user.otchestvo && user.otchestvo.includes(search)) ||
        (user.email && user.email.includes(search)) ||
        (user.country && user.country.includes(search))
      );
    }

    return users;
  }

  async findAll(): Promise<Users[]> {
    const query = `
    select * from users order by id
    `;

    return this.usersRepository.query(query);
  }

  findOne(id: number): Promise<Users>  {
    return this.usersRepository.findOneBy({id});
  }

  async findByEmail(email: string): Promise<Users> {
    const user = await this.usersRepository.findOneBy({ email });

    if(!user) {
      throw new NotFoundException('Email not found');
    }

    return user;
  }

  async findByEmailForSendMessage(email: string): Promise<Users | string> {
    const user = await this.usersRepository.findOneBy({ email });

    if(!user) {
      return user;
    }

    throw new Error('Пользователь уже существует');
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({id});

    if(!user) {
      throw new NotFoundException('User not found');
    }

    user.name = updateUserDto.name;
    user.surname = updateUserDto.surname;
    user.otchestvo = updateUserDto.otchestvo;
    user.email = updateUserDto.email;

    return this.usersRepository.save(user);
  }

  async remove(groupId:number, userId: number) {
    const user = await this.usersRepository.findOneBy({id: userId});

    if(!user) {
      throw new NotFoundException('User not found');
    }

    await this.groupsService.removeUserFromGroup(groupId, userId);

    return this.usersRepository.delete(userId);
  }

  async getGroupInUsers(userId: number): Promise<{ name: string; groups: string; email: string }> {

    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const query = `
      SELECT group_id FROM users_and_groups
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
