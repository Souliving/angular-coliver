import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {catchError, Observable, of, Subject, switchMap, tap} from 'rxjs';

import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  TuiButton,
  TuiDialogContext,
  TuiDialogService,
  TuiTextfield,
} from '@taiga-ui/core';
import {
  TuiDataListWrapper,
  TuiSelect,
  TuiStringifyPipe,
} from '@taiga-ui/kit';
import {TuiForm} from '@taiga-ui/layout';
import {
  TuiComboBoxModule,
  TuiInputModule,
  TuiInputRangeModule,
} from '@taiga-ui/legacy';
import {TuiIdentityMatcher, TuiLet} from '@taiga-ui/cdk';
import {injectContext} from '@taiga-ui/polymorpheus';
import {
  TuiMultiSelectModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';
import {City, Subway} from "../data/formsStructure";
import {CityApiService} from "../services/city-api/city-api.service";

@Component({
  selector: 'app-filter-location-dialog',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    TuiButton,
    TuiForm,
    TuiInputRangeModule,
    TuiTextfield,
    FormsModule,
    TuiDataListWrapper,
    TuiSelect,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiLet,
    TuiStringifyPipe,
    TuiComboBoxModule,
    TuiMultiSelectModule,],
  templateUrl: './filter-location-dialog.component.html',
  styleUrl: './filter-location-dialog.component.scss'
})
export class FilterLocationDialogComponent implements OnInit {
  private readonly dialogs = inject(TuiDialogService);

  protected value: FormGroup | null = null;
  protected name = '';
  protected items = [10, 50, 100];

  public readonly context =
    injectContext<TuiDialogContext<FormGroup, FormGroup>>();

  protected get data(): FormGroup {
    return this.context.data;
  }

  protected submit(): void {
    if (this.context.data !== null) {
      console.log(this.context.data);
      this.context.completeWith(this.context.data);
    }
  }

  cities$: Observable<City[]> | undefined;
  metroStations$: Observable<Subway[]> | undefined;

  constructor(private cityService: CityApiService) {
  }

  protected readonly stringify = ({name, id}: City): string =>
    `${name} ${id}`;

  ngOnInit() {
    // this.data.addControl('selectedCity', this.addressGroup)
    this.cities$ = this.cityService.getCities().pipe(
      tap((cities) => {
        const cityFromForm = this.data.get('cityId')?.value;

        if (cityFromForm && cities.length > 0) {
          const selectedCity = cities.find(
            (city: any) => city.id === cityFromForm.id
          );
          if (selectedCity) this.data.get('cityId')?.setValue(selectedCity);
        }
      }),
      catchError((error) => {
        console.error('Ошибка загрузки городов', error);
        return of([]); // Возвращаем пустой массив в случае ошибки
      })
    );
    console.log(this.data);
    this.cities$.forEach((value: any) => console.log(value));
    this.onCityChange();
  }

  onCityChange() {
    if (this.data) {
      this.data
      .get('cityId')
      ?.valueChanges.pipe(
        switchMap((city) => {
          console.log(city);
          if (city.cityId != null || city) {
            //this.data.get('metroIds')?.setValue([[]])
            console.log('filter', this.data.get('metroIds')?.value);
            return this.cityService.getMetroStations(city.id);
          } else {
            console.log('drop cities');
            return of([]); // Возвращаем пустой массив, если город не выбран
          }
        }),
        catchError((error) => {
          console.error('Ошибка загрузки станций метро', error);
          return of([]); // Возвращаем пустой массив в случае ошибки
        })
      )
      .subscribe((stations: any) => {
        const metroFromForm = this.data.get('metroIds')?.value;
        console.log('metro From form', metroFromForm);
        if (metroFromForm && stations.length > 0) {
          console.log('stations', stations);
          const selectedMetro = stations.filter((metro: any) =>
            metroFromForm.map((tmp: any) => tmp.id).includes(metro.id)
          );
          console.log('selected metro', selectedMetro);
          if (selectedMetro)
            this.data.get('metroIds')?.setValue(selectedMetro);
        }
        this.metroStations$ = of(stations);
      });
    }
  }
}
