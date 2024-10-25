import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const apiUrl = 'https://api.coliver.tech/api/v1/';

@Injectable({
  providedIn: 'root'
})

export class CityApiService {

  constructor(private http: HttpClient) {}

  // Получение списка городов
  getCities(): Observable<any> {
    return this.http.get(`${apiUrl}cities/`);
  }

  // Получение списка станций метро для выбранного города
  getMetroStations(cityId: string): Observable<any> {
    return this.http.get(`${apiUrl}metro/getAllMetroByCityId/${cityId}`);
  }
}
