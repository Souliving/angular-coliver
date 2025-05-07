import {Component, EventEmitter, Inject, inject, Input, Optional, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
  MatDialogActions,
  MatDialogContent
} from '@angular/material/dialog';
import {catchError, Observable, of, switchMap, tap} from 'rxjs';
import {CityApiService} from '../services/city-api/city-api.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButton, MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from "@angular/material/icon";
import {TuiAccordionComponent, TuiAccordionDirective, TuiExpand} from "@taiga-ui/experimental";
import {
  TuiButton,
  TuiDialogComponent,
  TuiDialogContext,
  TuiIcon, TuiInitialsPipe,
  TuiLabel,
  TuiTextfield
} from "@taiga-ui/core";
import {
  TuiCheckbox,
  TuiChevron,
  TuiDataListWrapper, TuiFilterByInputPipe,
  TuiSelect, TuiStringifyContentPipe,
  TuiStringifyPipe
} from "@taiga-ui/kit";
import {TuiForm} from "@taiga-ui/layout";
import {
  TuiComboBoxModule,
  TuiInputModule,
  TuiInputRangeModule,
  TuiTextfieldControllerModule
} from "@taiga-ui/legacy";
import {TuiContext, TuiLet} from "@taiga-ui/cdk";
import {PolymorpheusContent} from "@tinkoff/ng-polymorpheus";
import {City} from "../data/formsStructure";


@Component({
  selector: 'app-filter-location-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatButton, MatDialogActions, MatDialogContent, MatIcon, MatMiniFabButton,
    TuiAccordionComponent, TuiAccordionDirective, TuiButton, TuiCheckbox, TuiExpand, TuiForm,
    TuiInputRangeModule, TuiLabel, TuiTextfield, FormsModule, TuiDataListWrapper,
    TuiSelect, TuiIcon, TuiChevron, TuiDialogComponent, TuiInputModule, TuiTextfieldControllerModule, TuiLet, TuiStringifyPipe, TuiStringifyContentPipe, TuiFilterByInputPipe, TuiComboBoxModule, TuiInitialsPipe],
  templateUrl: './filter-location-dialog.component.html',
  styleUrl: './filter-location-dialog.component.scss'
})
export class FilterLocationDialogComponent {
  readonly dialogRef = inject(MatDialogRef<FilterLocationDialogComponent>);
  data = inject<FormGroup>(MAT_DIALOG_DATA);
  protected value: any | null = null;
  cities$: Observable<City[]> | undefined;
  //selectedCity?: { id: number; name: string };
  citis: City[] = [
    { id: 1, name: 'Москва' },
    { id: 2, name: 'Санкт-Петербург' },
    { id: 3, name: 'Казань' },
  ];
  addressGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl(null),
  });
  metroStations$: Observable<any> | undefined;

  constructor(
    private cityService: CityApiService,
  ) {
  }

  // cityStringify = (item: TuiContextWithImplicit<City> | City): string => {
  //   if ('$' in item) {
  //     return item.$.name;
  //   }
  //   return item.name;
  // };


  protected readonly stringify = ({name, id}: City): string =>
    `${name} ${id}`;
  ngOnInit() {
    // this.data.addControl('selectedCity', this.addressGroup)
    this.cities$ = this.cityService.getCities().pipe(
      tap(cities => {
        const cityFromForm = this.data.get('cityId')?.value;

        if (cityFromForm && cities.length > 0) {
          const selectedCity = cities.find((city: any) => city.id === cityFromForm.id);
          if (selectedCity) this.data.get('cityId')?.setValue(selectedCity);
        }
      }),
      catchError(error => {
        console.error('Ошибка загрузки городов', error);
        return of([]); // Возвращаем пустой массив в случае ошибки
      })
    );
    console.log(this.data)
    this.cities$.forEach((value: any) => console.log(value))
    this.onCityChange();
  }

  onCityChange() {
    if (this.data) {
      this.data.get('cityId')?.valueChanges
      .pipe(
        switchMap(city => {
          console.log(city)
          if (city.cityId != null || city) {
            console.log(city)
            return this.cityService.getMetroStations(city.id);
          } else {
            return of([]); // Возвращаем пустой массив, если город не выбран
          }
        }),
        catchError(error => {
          console.error('Ошибка загрузки станций метро', error);
          return of([]); // Возвращаем пустой массив в случае ошибки
        })
      )
      .subscribe((stations: any) => {
        const metroFromForm = this.data.get('metroIds')?.value;
        if (metroFromForm && stations.length > 0) {
          const selectedMetro = stations.filter((metro: any) =>
            metroFromForm.map((tmp: any) => tmp.id)
            .includes(metro.id))
          if (selectedMetro) this.data.get('metroIds')?.setValue(selectedMetro);
        }
        this.metroStations$ = of(stations);
      });
    }

  }

  submit() {
    console.log(this.data)
    this.dialogRef.close(this.data.value);
  }

  onNoClick = () => this.dialogRef.close()

  resetFilters(): void {

    const resetValues = {
      cityId: {id: null, name: null},  // Объект вместо null
      metroIds: [{id: null, name: null, cityId: null}]                      // Пустой массив
    };

    // Сбрасываем форму
    this.data.reset(resetValues);

  }
}
