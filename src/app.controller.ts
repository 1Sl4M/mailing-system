import { Controller, Get, Inject, Param, Put } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }
  @Get('country')
  getCountries() {
    return this.appService.getCountries();
  }

  @Get('country/city')
  getCountryAndCityId() {
    return this.appService.getCountryAndCityId();
  }

  @Get('city/:countryId')
  getCities(@Param('countryId') countryId: number) {
    return this.appService.getCities(countryId);
  }
}
