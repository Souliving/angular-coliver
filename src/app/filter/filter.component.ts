import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { CityApiService } from '../services/city-api/city-api.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { FilterLocationDialogComponent } from '../filter-location-dialog/filter-location-dialog.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSliderModule} from '@angular/material/slider';
import { FormsService } from '../services/forms/forms.service';
@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule,
            ReactiveFormsModule,
            MatFormFieldModule,
            MatSelectModule,
            MatInputModule,
            MatCheckboxModule,
            MatButtonModule,
            MatListModule,
            MatMenuModule,
            MatIconModule,
            MatExpansionModule,
            MatSliderModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {

  filterForm!: FormGroup ;

  currentCity = {id: null, name: null}
  currentMetro = [{id: null, name: null, cityId:null}]
  readonly allPreferences = [
    { value: 'smoking', display: 'Не курит' },
    { value: 'alcohol', display: 'Не пьет' },
    { value: 'pets', display: 'Без животных' },
  ]

  constructor(
    private fb: FormBuilder,
    private cityService: CityApiService,
    private dialog: MatDialog,
    private formService: FormsService
  ){}

  ngOnInit(){

    /* this.cities$ = this.cityService.getCities().pipe(
      catchError(error => {
        console.error('Ошибка загрузки городов', error);
        return of([]); // Возвращаем пустой массив в случае ошибки
      })
    ); */

    this.filterForm = this.fb.group({
      smoking: null,
      alcohol: null,
      petFriendly: null,
      isClean: null,
      age: this.fb.group({
        startAge: [null, [Validators.min(0)]],
        endAge: [null, [Validators.min(0)]]
      }),

      price: this.fb.group({
        startPrice: [null, [Validators.min(0)]],
        endPrice: [null, [Validators.min(0)]]
      }),
      cityId: [[]],
      metroIds: [[]]
    });

  //  this.onCityChange();
  }

/*   onCityChange(){
    if(this.filterForm){
      this.filterForm.get('location.city')?.valueChanges
      .pipe(
        switchMap(city => {
          if (city) {
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
      .subscribe(stations => {
        this.metroStations$ = of(stations);
      });
    }

  } */

  openFilterDialog(){
    const dialogRef = this.dialog.open(FilterLocationDialogComponent, {
      data: new FormGroup({cityId: new FormControl(this.currentCity), metroIds: new FormControl(this.currentMetro )}),
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log(result.cityId)
        if(result.cityId.id == null) {
          this.filterForm.controls['cityId'].setValue([]);
        } else {
          this.filterForm.controls['cityId'].setValue([result.cityId.id]);
        }
        this.currentCity = result.cityId;
        this.currentMetro = result.metroIds
        let updatedMetroIds: any[] = [];
        result.metroIds.forEach((element: any) => {
          // Проверяем, чтобы избежать дублирования, если это необходимо
          if (!updatedMetroIds.includes(element.id)) {
            updatedMetroIds.push(element.id);
          }
        });

        // Устанавливаем значение для metroIds после завершения цикла
        if (result.metroIds[0].id != null) {
          this.filterForm.controls['metroIds'].setValue(updatedMetroIds);
        } else {
          this.filterForm.controls['metroIds'].setValue([]);
        }

      }
      console.log('The dialog was closed', result);
    });
  }

  updatePreference(preference: string, isChecked: boolean) {
    console.log(preference, isChecked)
    this.filterForm.get(preference)?.setValue(isChecked);
  }

  submitForm(){
    this.formService.filterFormWithPhoto(this.filterForm.value)
    console.log(this.filterForm)
  }

  toCleanAge(){
    this.filterForm.get('age')?.patchValue({
      startAge: null,
      endAge: null
    });
  }

  toCleanPrice(){
    this.filterForm.get('price')?.patchValue({
      startPrice: null,
      endPrice: null
    });
  }

  toCleanForm(){
    this.filterForm.reset();
    this.formService.initFormsWithPhoto()
  }

}
