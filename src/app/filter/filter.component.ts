import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
            MatIconModule],
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
    private dialog: MatDialog
  ){}

  ngOnInit(){

    this.cities$ = this.cityService.getCities().pipe(
      catchError(error => {
        console.error('Ошибка загрузки городов', error);
        return of([]); // Возвращаем пустой массив в случае ошибки
      })
    );

    this.filterForm = this.fb.group({
      preferences: [[]],

      age: this.fb.group({
        from: [null, [Validators.min(0)]],
        to: [null, [Validators.min(0)]]
      }),

      price: this.fb.group({
        from: [null, [Validators.min(0)]],
        to: [null, [Validators.min(0)]]
      }),

      location: this.fb.group({
        city: null,
        station: [null]
      })

    });
   
    this.onCityChange();
  }

  onCityChange(){
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
    
  }
  openFilterDialog(){
    console.log(this.filterForm.get('location'))
    const dialogRef = this.dialog.open(FilterLocationDialogComponent, {
      data: this.filterForm.get('location'),
      width: '50%',
      height: '50%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      
    });
  }

  submitForm(){

  }

}
