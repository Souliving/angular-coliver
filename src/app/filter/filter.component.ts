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
  cities$: Observable<any> | undefined;
  metroStations$:Observable<any> | undefined;
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
      smoking: [true],
      alcohol: [true],
      petFriendly: [true],
      isClean: [true],
      age: this.fb.group({
        startAge: [0, [Validators.min(0)]],
        endAge: [0, [Validators.min(0)]]
      }),

      price: this.fb.group({
        startPrice: [0, [Validators.min(0)]],
        endPrice: [0, [Validators.min(0)]]
      }),
      cityId: null,
      metroIds: []
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
    console.log('open')
    const dialogRef = this.dialog.open(FilterLocationDialogComponent, {
      data: new FormGroup({cityId: new FormControl(this.filterForm.get('cityId')?.value), metroIds: new FormControl(this.filterForm.get('metroIds')?.value)}),
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) this.filterForm.controls['location'].setValue(result)
      console.log('The dialog was closed', result);
    });
  }

  updatePreference(preference: string, isChecked: boolean) {
    this.filterForm.get(preference)?.setValue(isChecked);
  }

  submitForm(){
    //this.formService.filterFormWithPhoto(this.filterForm.value)
    console.log(this.filterForm)
  }

}
