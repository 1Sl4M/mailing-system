import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from "typeorm";
import { Letters } from '../entity/letters.entity';
import { CreateLetterDto } from "./dto/create-letter.dto";
import { Spam } from "../entity/spam.entity";

@Injectable()
export class LettersService {
  constructor(
    @InjectRepository(Letters) private readonly letterRepository: Repository<Letters>,
    @InjectRepository(Spam) private readonly spamRepository: Repository<Spam>,
  ) {}

  async findLetters(letterId: number) {
    const query = `
    select letters.id, letters.theme, letters.content, spams.created_at from spams
    join letters on letters.id = spams.letter_id
    where letters.id = ${letterId}
    group by letters.id, letters.theme, letters.content, spams.created_at
    order by letters.id
    `;

    return this.letterRepository.query(query);
  }

  async getOneLetter(id: number): Promise<Letters> {
    return await this.letterRepository.findOneBy({ id });
  }

  async getAllLetters(): Promise<Letters[]> {
    return this.letterRepository.find();
  }

  async createLetter(dto: CreateLetterDto):Promise<Letters> {
    const { theme, content } = dto;
    const letter = new Letters();
    letter.theme = theme;
    letter.content = content;

    await this.letterRepository.save(letter);

    return letter;
  }

  async getAllSpams(): Promise<Spam[]> {
    return this.spamRepository.find();
  }
}
