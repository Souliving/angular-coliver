import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsApiService } from '../services/forms-api/forms-api.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserApiService } from '../services/user-api/user-api.service';
import { User } from '../data/userStructure';
import { CommonModule } from '@angular/common';
import { CityApiService } from '../services/city-api/city-api.service';
import { Observable } from 'rxjs';

import { TuiCardLarge, TuiForm, TuiHeader } from '@taiga-ui/layout';
import { TuiAppearance, TuiButton, TuiTextfield, TuiTitle } from '@taiga-ui/core';

import { RentFlatStepComponent } from './steps-components/rent-flat-step/rent-flat-step.component';
import { CreateNewAdService } from '../services/create-new-ad/create-new-ad.service';
import { SecondStepComponent } from './steps-components/second-steps/second-step.component';
import { HasFlatStepComponent } from './steps-components/has-flat-step/has-flat-step.component';

@Component({
  selector: 'app-create-form-page',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule, 
    FormsModule,
    RentFlatStepComponent,
    SecondStepComponent,
    HasFlatStepComponent,
    TuiAppearance, 
    TuiCardLarge, 
    TuiForm,  
    TuiHeader, 
    TuiTitle, 
    TuiTextfield,  
    TuiButton,],
  templateUrl: './create-form-page.component.html',
  styleUrl: './create-form-page.component.scss'
})
export class CreateFormPageComponent {
  newAdForm!: FormGroup;
  rentNewAd!: FormGroup;
  ownNewAd!: FormGroup;
  isFirstStepCompleted: boolean = false;


  
  user: User | null | undefined;

  cities$: Observable<any> | undefined;
  metroStations$:Observable<any> | undefined;
  readonly genderList = [
    { value: 'female', label: 'Женщина' },
    { value: 'male', label: 'Мужчина' },
    { value: 'nogender', label: 'И мужчины, и женщины' }
  ];

  readonly maritalStatusList =[
    { value: 'free', label: 'Свободен' },
    { value: 'married', label: 'Замужем/Женат' },
    { value: 'relationship', label: 'В отношениях' }
  ];

  readonly employmentTypeList = [
    { value: 'shifts', label: 'Работаю вахтами' },
    {value: 'office', label:'Работа 5/2'},
    {value: 'remote', label:'Удаленная работа'},
    { value: 'floatingChart', label: 'Плавающий график' },
    { value: 'freelance', label: 'На фрилансе' },
    { value: 'student', label: 'Студент' },
    { value: 'noJob', label: 'Безработный' },
  ]

  readonly lifeStyleList = [
    { value: 'earlyGetUp', label: 'Встаю рано' },
    {value: 'lateGetUp', label:'Встаю поздно'},
    {value: 'middleGetUp', label:'Плавающий режим сна'},
  ]
 readonly cleaning = [0, 1, 2, 3, 4, 5]



 activeTypeRent: string = 'rent';
  constructor(
    private formsApiService: FormsApiService,
    private cityService: CityApiService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder, private userApiService: UserApiService, private cd: ChangeDetectorRef, private newAdService: CreateNewAdService){}

  ngOnInit(){
   this.user= this.userApiService.getAuthUserValue()
   this.newAdService.loadCities()
   //this.setRentNewAd()
  }

setActive = (mode: string) =>{
  this.activeTypeRent = this.activeTypeRent === mode ? '' : mode;
  console.log(this.ownNewAd)
  if(this.activeTypeRent !== mode && !this.ownNewAd) this.setOwnNewAd()
}

setRentNewAd(){
  this.rentNewAd = this.fb.group({
    city:[''],
     metro:[[], Validators.required],
     withColivers:[''],
     coliversCount:[0],
     coliversGender:[[]],
     budget:[0],
     moveDate:[new Date()],
  })
  setTimeout(() => this.cd.detectChanges());  
}

setOwnNewAd(){
  this.ownNewAd = this.fb.group({
    address: ['', Validators.required],
    metro:[[], Validators.required],
    roomsCount:[0],
    freeRoomsCount:[0],
    coliversCount:[0],
    genderColivers:[[]],
    budget:[0],
    moveDate:[new Date()],
    photos:[[]],
  })

}

nextStep(form: FormGroup){
  this.isFirstStepCompleted= true;
  console.log(form.value) 
}

}
