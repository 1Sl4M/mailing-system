import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { City } from "./entity/city.entity";
import { Repository } from "typeorm";
import { Country } from "./entity/country.entity";

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(City) private readonly cityRepository: Repository<City>,
    @InjectRepository(Country) private readonly countryRepository: Repository<Country>
  ) {
  }
  getHello(): string {
    return 'Hello World!';
  }

  async getCities(countryId: number) {
    const query = `
    SELECT cities.city_id, cities.city_name FROM cities
    join countries on ${countryId} =  cities.country_id
    group by cities.city_id, cities.city_name
    `;

    return this.cityRepository.query(query);
  }

  async getCountries() {
    const query = `
    SELECT country_id, country_name FROM countries
    `;

    return this.countryRepository.query(query);
  }
}
