import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsApiService } from '../services/forms-api/forms-api.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserApiService } from '../services/user-api/user-api.service';
import { User } from '../data/userStructure';
import {MatStepperModule} from '@angular/material/stepper';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CityApiService } from '../services/city-api/city-api.service';
import { catchError, Observable, of, switchMap } from 'rxjs';
@Component({
  selector: 'app-create-form-page',
  standalone: true,
  imports: [MatStepperModule, MatInputModule, ReactiveFormsModule, MatCheckboxModule, MatButtonModule, MatFormFieldModule, MatSelectModule, CommonModule, MatIcon, MatChipsModule],
  templateUrl: './create-form-page.component.html',
  styleUrl: './create-form-page.component.scss'
})
export class CreateFormPageComponent {
  newAdForm!: FormGroup ;
  firstStepGroup!: FormGroup ;
  secondStepGroup: FormGroup | undefined ;
  secondStepNoFlatGroup: FormGroup | undefined;
  thirdStepGroup!: FormGroup;
  user: User | null | undefined;
  selectedHomeOwnerType: number | undefined;
  cities$: Observable<any> | undefined;
  metroStations$:Observable<any> | undefined;
  readonly genderList = [
    { value: 'female', label: 'Женщина' },
    { value: 'male', label: 'Мужчина' },
    { value: 'nogender', label: 'И мужчины, и женщины' }
  ];
  
 
  constructor(
    private formsApiService: FormsApiService,
    private cityService: CityApiService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder, private userApiService: UserApiService,){}

  ngOnInit(){
   this.user= this.userApiService.getAuthUserValue()
   if(this.user){
    this.firstStepGroup = this.fb.group({
      homeOwnerType:null,
    })
    this.changeFirstStep()

  

    


    this.thirdStepGroup = this.fb.group({
      budget: 0,
      dateMove: '',
    })
   }
   
  }
  changeFirstStep() {
    this.firstStepGroup.get('homeOwnerType')?.valueChanges.subscribe(value => {
      if(value ==0){
        this.secondStepNoFlatGroup = undefined;
          this.secondStepGroup = this.fb.group({
            homeTypesIds: null,
            location: this.fb.group({
              city: null,
              station: []
            }),
            neighbours: this.fb.group({
              count: null,
              gender: null
            }),
            freeRooms:null,
            price: null,
            conditionsList: this.fb.group({
              internet: false,
              tv: false,
              kitchen: false,
              furniture: false,
              washingMachine: false,
              balcony: false,
              airConditioner: false,
              parking: false
            })
        })
      }
      else{
        this.secondStepGroup = undefined;
        this.secondStepNoFlatGroup = this.fb.group({
        price:this.fb.group({
          from: [null, [Validators.min(0)]],
          to: [null, [Validators.min(0)]]
        }),
        homeTypesIds: [],
        location: this.fb.group({
          city: null,
          station: []
        }),
        conditionsList: this.fb.group({
          internet: false,
          tv: false,
          kitchen: false,
          furniture: false,
          washingMachine: false,
          balcony: false,
          airConditioner: false,
          parking: false
        }),
        neighboursGender:null,
        neighboursAge:this.fb.group({
          from: [null, [Validators.min(0)]],
          to: [null, [Validators.min(0)]]
        }),

      })
      }
    });
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

    if(this.secondStepNoFlatGroup){
      this.secondStepNoFlatGroup.get('location.city')?.valueChanges
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
