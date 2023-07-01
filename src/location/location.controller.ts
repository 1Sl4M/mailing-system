import { Controller, Get, Param } from "@nestjs/common";
import { LocationService } from "./location.service";

@Controller()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}
  @Get('country')
  getCountries() {
    return this.locationService.getCountries();
  }

  @Get('country/city')
  getCountryAndCity() {
    return this.locationService.getCountryAndCity();
  }

  @Get('city/:countryId')
  getCities(@Param('countryId') countryId: number) {
    return this.locationService.getCities(countryId);
  }
}
