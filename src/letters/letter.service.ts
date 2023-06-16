import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Letters } from '../entity/letters.entity';

@Injectable()
export class LetterService {
  constructor(
    @InjectRepository(Letters)
    private readonly letterRepository: Repository<Letters>,
  ) {}

  async getLetterFromDatabase(id: number): Promise<Letters> {
    return await this.letterRepository.findOneBy({ id });
  }
}
