import { Controller, Get, Post, Body, Param, Delete, Query, Put } from "@nestjs/common";
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from "../entity/users.entity";
import { FilterDto } from "./dto/filter.dto";
import { GroupsService } from "../groups/groups.service";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly groupsService: GroupsService) {}

  @Get('filter')
  async getUsers(@Query() dto: FilterDto): Promise<Users[]> {
    if (Object.keys(dto).length) {
      const users = await this.usersService.getUsersWithFilters(dto);
      return users.filter(user => user.deleted === false);
    }

    const users = await this.usersService.findAllUsers();
    return users.filter(user => user.deleted === false);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<Users> {
    return this.usersService.create(createUserDto);
  }

  @Get(':userId')
  getUserWithGroups(@Param('userId') userId: number) {
    return this.usersService.getUserWithGroups(userId);
  }

  @Get('email')
  findByEmailForSendMessage(@Body() dto: CreateUserDto) {
    return this.usersService.findByEmailForSendMessage(dto.email);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<Users> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':userId')
  remove(@Param('userId') userId: number): Promise<void> {
    return this.usersService.remove(userId);
  }
}