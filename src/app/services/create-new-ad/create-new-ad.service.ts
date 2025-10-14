import { Injectable, signal } from '@angular/core';
import { CityApiService } from '../city-api/city-api.service';
import { City, Subway } from '../../data/formsStructure';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateNewAdService {

  hasApartment = signal<boolean | null>(null);
  city = signal<City | null>(null);
  metro = signal<Subway[] | null>(null);

  // Асинхронные данные
  cities = signal<City[]>([]);
  metros = signal<Subway[]>([]);


  // Кэш для метро по городам
  private metrosCache = new Map<string, Subway[]>();

  // Данные шагов
  step1Data = signal<any>({});
  step2Data = signal<any>({});

  constructor(private cityApiService: CityApiService) {
  }
 
  // --- Методы загрузки данных ---
  loadCities() {
    this.cityApiService.getCities().subscribe(cities => {
      console.log(cities)
      this.cities.set(cities);  
    })
  }

  loadMetros(city: City) {
    if (this.metrosCache.has(city.name || '')) {
      this.metros.set(this.metrosCache.get(city.name || '')!);
      return;
    }

    this.cityApiService.getMetroStations(city.id || 1).subscribe(metros => {
        this.metrosCache.set(city.name || '', metros);
        this.metros.set(metros);
      });
  }

  setCity(city: City){
    this.city.set(city);
    this.loadMetros(city)
  }

  setMetro(metro: Subway[]){
    this.metro.set(metro)
  }

  // --- Обновления ---
  updateStep1(partial: Partial<any>) {
    this.step1Data.update(current => ({ ...current, ...partial }));
  }

  updateStep2(partial: Partial<any>) {
    this.step2Data.update(current => ({ ...current, ...partial }));
  }

  submitAd() {
    const payload = {
      hasApartment: this.hasApartment(),
      city: this.city(),
      metro: this.metro(),
      ...this.step1Data(),
      ...this.step2Data(),
    };
    console.log('Отправка на сервер', payload);
    // return this.http.post('/api/ad', payload);
  }
}
