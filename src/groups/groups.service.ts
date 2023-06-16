import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Groups } from "../entity/groups.entity";
import { FindOneOptions, Repository } from "typeorm";
import { Users } from "../entity/users.entity";
import { CreateGroupDto } from "./dto/create-group.dto";
import { FilterDto } from "../users/dto/filter.dto";

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Groups) private readonly groupsRepository: Repository<Groups>,
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
  ) {
  }

  findAll() {
    return this.groupsRepository.find();
  }

  findById(id: number) {
    return this.groupsRepository.findOneBy({ id });
  }

  async update(id: number, updateGroupDto: UpdateGroupDto): Promise<Groups> {
    const group = await this.groupsRepository.findOneBy({ id });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    group.title = updateGroupDto.title;
    group.description = updateGroupDto.description;

    return group;
  }

  async remove(id: number): Promise<void> {
    const group = await this.groupsRepository.findOneBy({ id });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    await this.groupsRepository.delete(id);
  }

  async createGroup(dto: CreateGroupDto) {
    return await this.groupsRepository.save(dto);
  }

  async getGroupsWithFilters(dto: FilterDto): Promise<Groups[]> {
    const users = await this.usersRepository.find();

    const { search } = dto;

    let groups = await this.findAll();

    if(search) {
      groups = groups.filter(group =>
        group.id.toString().includes(search) ||
        group.title.includes(search) ||
        group.description.includes(search)
      );
    }

    return groups;
  }

  async addUserToGroup(groupId: number, userId: number): Promise<void> {
    const optionsGroup: FindOneOptions<Groups> = {
      where: { id: groupId },
    };
    const group = await this.groupsRepository.findOne(optionsGroup);

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const user = await this.usersRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.groups", "groups")
      .where("user.id = :userId", { userId })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.groups) {
      user.groups = [];
    }

    user.groups.push(group);

    await this.usersRepository.save(user);
  }

  async getUsersInGroup(groupId: number): Promise<{ title: string, id: number, description: string, users: Users[] }[]> {
    const optionsGroup: FindOneOptions<Groups> = {
      where: { id: groupId },
    };
    const group = await this.groupsRepository.findOne(optionsGroup);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const usersInGroup = await this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.groups', 'group', 'group.id = :groupId', { groupId })
      .select('group.id', 'group_id')
      .addSelect('user.id', 'user_id')
      .getRawMany();

    const userIds = usersInGroup.map(user => user.user_id);
    const users = await this.usersRepository.findByIds(userIds);

    return [{
      title: group.title,
      id: group.id,
      description: group.description,
      users: users,
    }];
  }

  async removeUserFromAllGroups(userId: number): Promise<{ msg: string }> {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if(!user) {
      throw new NotFoundException('User not found');
    }

    const query = `
      SELECT group_id FROM users_and_groups
      WHERE user_id = ${userId}
    `;

    const groups = await this.groupsRepository.query(query);

    for (const group of groups) {
      await this.removeUserFromGroup(group.id, userId);
    }

    await this.usersRepository.save(user);

    return {
      msg: 'User deleted from all groups'
    }
  }

  async removeUserFromGroup(groupId: number, userId: number): Promise<{ title: string; id: number; description: string; users: Users[] }[]> {
    const group = await this.groupsRepository.findOneBy({ id: groupId });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const user = await this.usersRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.groups", "groups")
      .where("user.id = :userId", { userId })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.groups) {
      user.groups = [];
    }

    user.groups.pop();

    await this.usersRepository.save(user);
    return await this.getUsersInGroup(groupId);
  }
}
