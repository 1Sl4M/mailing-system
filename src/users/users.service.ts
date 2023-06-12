import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../entity/users.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private readonly usersRepository: Repository<Users>) {}

  create(dto: CreateUserDto) {
    return this.usersRepository.save(dto);
  }

  findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<Users>  {
    return this.usersRepository.findOneBy({id});
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

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({id});

    if(!user) {
      throw new NotFoundException('User not found');
    }

    return this.usersRepository.delete(id);
  }
}
