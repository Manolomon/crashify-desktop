import { Injectable } from '@angular/core';

declare var H: any;

@Injectable({
  providedIn: 'root'
})
export class HereService {

  public platform: any;
  public geocoder: any;

  public constructor() {
    // https://developer.here.com/blog/using-the-here-geocoder-api-for-javascript-in-an-angular-application
    this.platform = new H.service.Platform({
      app_id: 'zYnGMCBW5uCrUsBWPrdX',
      app_code: 'o67LvF8wyN3mt6PvYzw1wg'
    });
    this.geocoder = this.platform.getGeocodingService();
  }

  public getAddress(query: string) {
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ searchText: query }, result => {
        if (result.Response.View.length > 0) {
          if (result.Response.View[0].Result.length > 0) {
            resolve(result.Response.View[0].Result);
          } else {
            reject({ message: 'no results found' });
          }
        } else {
          reject({ message: 'no results found' });
        }
      }, (error: any) => {
        reject(error);
      });
    });
  }

  public getAddressFromLatLng(query: string) {
    return new Promise((resolve, reject) => {
      this.geocoder.reverseGeocode({ prox: query, mode: 'retrieveAddress' }, result => {
        if (result.Response.View.length > 0) {
          if (result.Response.View[0].Result.length > 0) {
            resolve(result.Response.View[0].Result);
          } else {
            reject({ message: 'no results found' });
          }
        } else {
          reject({ message: 'no results found' });
        }
      }, (error: any) => {
        reject(error);
      });
    });
  }

  public getCityFromCoordinates(lat: number, lon: number): string {
    const position = lat + ',' + lon;
    let locations: Array<any>;
    let response = 'Not found';
    this.getAddressFromLatLng(position).then(result => {
      locations = result as Array<any>;
      response = locations[0].Location.Address.City;
    }, error => {
      console.log(error);
    });
    return response;
  }

}
