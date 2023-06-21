import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query } from "@nestjs/common";
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { FilterDto } from "../users/dto/filter.dto";
import { Groups } from "../entity/groups.entity";

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  createGroup(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.createGroup(createGroupDto);
  }
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.groupsService.remove(+id);
  }

  @Get()
  getGroupsWithFilters(@Query() dto: FilterDto): Promise<Groups[]> {
    if(Object.keys(dto).length) {
      return this.groupsService.getGroupsWithFilters(dto);
    }

    return this.groupsService.findAll();
  }

  // @Get('/sort')
  // sortGroup() {
  //   return this.groupsService.sortGroup();
  // }

  @Post(':groupId/users/:userId')
  addUserToGroup(@Param('groupId') groupId: number, @Param('userId') userId: number) {
    return this.groupsService.addUserToGroup(groupId, userId);
  }

  @Get('/users/:id')
  getUsersInGroup(@Param('id') id: number) {
    return this.groupsService.getUsersInGroup(id);
  }

  // @Get(':groupId/:letterId')
  // async getSpamGroup(@Param('groupId') groupId: number, @Param('letterId') letterId: number) {
  //   return this.groupsService.getSpamGroup(groupId, letterId);
  // }

  @Delete(':groupId/users/:userId')
  removeUserFromGroup(@Param('groupId') groupId: number, @Param('userId') userId: number) {
    return this.groupsService.removeUserFromGroup(groupId, userId);
  }

  @Delete('users/:userId')
  removeUserFromAllGroups(@Param('userId') userId: number) {
    return this.groupsService.removeUserFromAllGroups(userId);
  }
}
