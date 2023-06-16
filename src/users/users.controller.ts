import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from "../entity/users.entity";
import { FilterDto } from "./dto/filter.dto";
import { DeleteResult } from "typeorm";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(@Query() dto: FilterDto): Promise<Users[]> {
    if(Object.keys(dto).length) {
      return this.usersService.getUsersWithFilters(dto);
    }

    return this.usersService.findAll();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<Users> {
    return this.usersService.create(createUserDto);
  }

  @Get(':userId')
  getGroupInUsers(@Param('userId') userId: number) {
    return this.usersService.getGroupInUsers(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Users> {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<Users> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':userId/groups/:groupId')
  remove(@Param('userId') userId: number, @Param('groupId') groupId: number): Promise<DeleteResult> {
    return this.usersService.remove(groupId, userId);
  }
}