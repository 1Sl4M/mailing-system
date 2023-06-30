import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Groups } from "../entity/groups.entity";
import { FindOneOptions, Repository } from "typeorm";
import { Users } from "../entity/users.entity";
import { CreateGroupDto } from "./dto/create-group.dto";
import { FilterDto } from "../users/dto/filter.dto";
import { SentUsers } from "../entity/sent_users.entity";

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Groups) private readonly groupsRepository: Repository<Groups>,
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
    @InjectRepository(SentUsers) private readonly sentUsersRepository: Repository<SentUsers>,
  ) {
  }

  async findAllGroups() {
    const groups = await this.groupsRepository.find();

    const results = [];
    for (const group of groups) {
      const usersInGroup = await this.getUsersInGroup(group.id);
      results.push({
        title: group.title,
        id: group.id,
        description: group.description,
        created_at: group.created_at,
        users: usersInGroup,
      });
    }

    const query = `
    select * from groups order by id
    `;
    await this.groupsRepository.query(query);

    return results;
  }

  async findOneGroup(groupId: number) {
    const query = `
    select groups.id, groups.title, groups.description from spams
    join groups on groups.id = ${groupId}
    where ${groupId} = groups.id
    group by groups.id, groups.title, groups.description
    `;

    return this.groupsRepository.query(query);
  }

  async updateGroup(id: number, updateGroupDto: UpdateGroupDto): Promise<Groups> {
    const group = await this.groupsRepository.findOneBy({ id });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    group.title = updateGroupDto.title;
    group.description = updateGroupDto.description;

    await this.groupsRepository.save(group);

    return group;
  }

  async removeGroup(id: number): Promise<void> {
    const group = await this.groupsRepository.findOneBy({ id });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const query = `
    delete from user_group
    where group_id = ${id}
  `;
    const query1 = `
    delete from spams
    where group_id = ${id}
  `;

    const query2 = `
    delete from user_email_history
    where spam_id in (
      select id
      from spams
      where group_id = ${id}
    )
  `;

    await this.groupsRepository.query(query2);
    await this.groupsRepository.query(query1);
    await this.groupsRepository.query(query);
    await this.groupsRepository.remove(group);
  }

  async createGroup(dto: CreateGroupDto) {
    let newDate = new Date();

    const query = `
        insert into groups(title, description, created_at) 
        values('${dto.title}', '${dto.description}', '${newDate.toISOString()}')
      `;

    return await this.groupsRepository.query(query);
  }

  async getGroupsWithFilters(dto: FilterDto): Promise<Groups[]> {
    const users = await this.usersRepository.find();

    const { search } = dto;

    let groups = await this.findAllGroups();

    if (search) {
      groups = groups.filter(group =>
        (group.id && group.id.toString().includes(search)) ||
        (group.title && group.title.includes(search)) ||
        (group.description && group.description.includes(search)) ||
        group.users.some(user => user.id && user.id.toString().includes(search)) ||
        group.users.some(user => user.name && user.name.includes(search)) ||
        group.users.some(user => user.email && user.email.includes(search))
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

  async getUsersInGroup(groupId: number): Promise<Users[]> {
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

    return users
      // title: group.title,
      // id: group.id,
      // description: group.description,
  }

  async removeUserFromAllGroups(userId: number): Promise<{ msg: string }> {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const query = `
    SELECT group_id FROM user_group
    WHERE user_id = ${userId}
  `;

    const groups = await this.groupsRepository.query(query);

    for (const group of groups) {
      await this.removeUserFromGroup(group.group_id, userId);
    }

    return {
      msg: 'User deleted from all groups',
    };
  }

  async removeUserFromGroup(groupId: number, userId: number) {
    const query = `
    delete from user_group
    where group_id = ${groupId} and user_id = ${userId}
    `;

    await this.groupsRepository.query(query);
  }
}
