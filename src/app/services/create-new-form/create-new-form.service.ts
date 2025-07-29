import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CreateNewFormService {
  secondStepGroup: FormGroup | undefined ;
  secondStepNoFlatGroup: FormGroup | undefined;
  thirdStepGroup!: FormGroup;
  constructor(private fb: FormBuilder,) { }

  initFlatSecondStep(){
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
  clickTo(){
    console.log(
      this.secondStepGroup
    )
  }
}

