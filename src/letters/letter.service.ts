import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from "typeorm";
import { Letters } from '../entity/letters.entity';
import { CreateLetterDto } from "./dto/create-letter.dto";

@Injectable()
export class LetterService {
  constructor(
    @InjectRepository(Letters) private readonly letterRepository: Repository<Letters>,
  ) {}

  async getLetterFromDatabase(id: number): Promise<Letters> {
    const options: FindOneOptions<Letters> = { where: { id } };
    return await this.letterRepository.findOne(options);
  }

  async createLetter(dto: CreateLetterDto):Promise<Letters> {
    const { theme, content } = dto;
    const letter = new Letters();
    letter.theme = theme;
    letter.content = content;

    return await this.letterRepository.save(letter);
  }
}
