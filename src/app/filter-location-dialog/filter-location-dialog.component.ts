import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { CityApiService } from '../services/city-api/city-api.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-filter-location-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatButton, MatDialogActions, MatDialogContent],
  templateUrl: './filter-location-dialog.component.html',
  styleUrl: './filter-location-dialog.component.scss'
})
export class FilterLocationDialogComponent {
  readonly dialogRef = inject(MatDialogRef<FilterLocationDialogComponent>);
  data = inject<FormGroup>(MAT_DIALOG_DATA);

  cities$: Observable<any> | undefined;
  metroStations$:Observable<any> | undefined;
  constructor(
    private cityService: CityApiService,
  ){}

  ngOnInit(){
    this.cities$ = this.cityService.getCities().pipe(
      catchError(error => {
        console.error('Ошибка загрузки городов', error);
        return of([]); // Возвращаем пустой массив в случае ошибки
      })
    );
    console.log(this.data)
    this.onCityChange();
  }

  onCityChange(){
    if(this.data){
      this.data.get('cityId')?.valueChanges
      .pipe(
        switchMap(city => {
          if (city) {
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
        this.metroStations$ = of(stations);
      });
    }
    
  }

  submit(){
    this.dialogRef.close(this.data.value);
  }
  onNoClick = () => this.dialogRef.close()
  
}
