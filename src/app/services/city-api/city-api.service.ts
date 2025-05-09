import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {City, Subway} from "../../data/formsStructure";

const apiUrl = 'https://api.coliver.tech/api/v1/';

@Injectable({
  providedIn: 'root'
})

export class CityApiService {

  constructor(private http: HttpClient) {}

  // Получение списка городов
  getCities(): Observable<City[]> {
    return this.http.get<City[]>(`${apiUrl}cities/`);
  }

  // Получение списка станций метро для выбранного города
  getMetroStations(cityId: string): Observable<Subway[]> {
    return this.http.get<Subway[]>(`${apiUrl}metro/getAllMetroByCityId/${cityId}`);
  }
}
