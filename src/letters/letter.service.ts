import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from "typeorm";
import { Letters } from '../entity/letters.entity';
import { CreateLetterDto } from "./dto/create-letter.dto";
import { Spam } from "../entity/spam.entity";

@Injectable()
export class LetterService {
  constructor(
    @InjectRepository(Letters) private readonly letterRepository: Repository<Letters>,
    @InjectRepository(Spam) private readonly spamRepository: Repository<Spam>,
  ) {}

  async findLetters(letterId: number) {
    const query = `
    select letters.id, letters.theme, letters.content from spam
    join letters on letters.id = ${letterId}
    where letters.id = ${letterId}
    group by letters.id, letters.theme, letters.content
    `;

    return this.letterRepository.query(query);
  }

  async getLetterFromDatabase(id: number): Promise<Letters> {
    return await this.letterRepository.findOneBy({ id });
  }

  async createLetter(dto: CreateLetterDto):Promise<Letters> {
    const { theme, content } = dto;
    const letter = new Letters();
    letter.theme = theme;
    letter.content = content;

    await this.letterRepository.save(letter);

    return letter;
  }

  async getAllSpam(): Promise<Spam[]> {
    return this.spamRepository.find();
  }
}
