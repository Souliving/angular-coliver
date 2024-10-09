import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSelectModule} from '@angular/material/select';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { CityApiService } from '../../../services/city-api/city-api.service';
import { CreateNewFormService } from '../../../create-new-form.service';
@Component({
  selector: 'app-second-step',
  standalone: true,
  imports: [MatSelectModule, ReactiveFormsModule, MatCheckboxModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatIcon, MatChipsModule, MatStepperModule],
  templateUrl: './second-step.component.html',
  styleUrl: './second-step.component.scss'
})
export class SecondStepComponent {
  secondStepGroup: FormGroup | undefined ;
  thirdStepGroup!: FormGroup;
  cities$: Observable<any> | undefined;
  metroStations$:Observable<any> | undefined;
  readonly genderList = [
    { value: 'female', label: 'Женщина' },
    { value: 'male', label: 'Мужчина' },
    { value: 'nogender', label: 'И мужчины, и женщины' }
  ];
  
  constructor(
    private fb: FormBuilder, 
    private cityService: CityApiService,
    private createFormService: CreateNewFormService){}
  
  ngOnInit(){
    this.createFormService.initFlatSecondStep();
    this.secondStepGroup = this.createFormService.secondStepGroup
  }

  onCityChange(){
    if(this.secondStepGroup){
      this.secondStepGroup.get('location.city')?.valueChanges
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
  decrementRoomsCount(){
    if(this.secondStepGroup){
      const currentCount = this.secondStepGroup.get('neighbours.count')?.value || 0;
      if(currentCount > 0){
        const newCount = currentCount - 1;
        this.secondStepGroup.get('neighbours')?.patchValue({
          count: newCount
        });
      }
      this.createFormService.clickTo()
    }
  }

  incrementRoomsCount(){
    if(this.secondStepGroup){
       const currentCount = this.secondStepGroup.get('neighbours.count')?.value || 0;
      const newCount = currentCount + 1;
      this.secondStepGroup.get('neighbours')?.patchValue({
        count: newCount
      });
    }
  }

  incrementFreeRoomsCount(){ 
    if(this.secondStepGroup){
      const allRoomsCount =  this.secondStepGroup.get('neighbours.count')?.value || 0;
      const currentCount = this.secondStepGroup.get('freeRooms')?.value || 0;
      console.log(allRoomsCount, currentCount)
      if(currentCount < allRoomsCount){
        const newCount = currentCount + 1;
        this.secondStepGroup.get('freeRooms')?.patchValue(newCount);
      }
    }
  }
  decrementFreeRoomsCount(){
    if(this.secondStepGroup){
      const currentCount = this.secondStepGroup.get('freeRooms')?.value || 0;
   
      if(currentCount > 0 ){
        const newCount = currentCount - 1;
        this.secondStepGroup.get('freeRooms')?.patchValue({
          count: newCount
        });
      }
    }
  }

  toggleGender(gender: string) {
    if(this.secondStepGroup)
      this.secondStepGroup.get('neighbours.gender')?.patchValue(gender); // Обновляем форму
    
  }

 addGender(gender: string){
  if(this.secondStepGroup){
    let currentGenderArray = this.secondStepGroup.get('neighbours.gender')?.value || [];
    currentGenderArray.push(gender);
    this.secondStepGroup.get('neighbours.gender')?.patchValue(currentGenderArray);
  }
 }
}
