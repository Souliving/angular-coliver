import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CityApiService } from '../../../services/city-api/city-api.service';
import {TuiChevron, TuiInputChip, TuiInputRange, TuiMultiSelect, TuiSelectDirective, TuiStringifyPipe, TuiTextarea} from '@taiga-ui/kit';
import {TuiButton, TuiDataList, TuiSelect, TuiTextfield} from '@taiga-ui/core';
import { TuiStringHandler } from '@taiga-ui/cdk';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'second-step',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TuiInputRange,
    TuiTextfield,
    TuiInputChip,
    TuiMultiSelect,
    TuiDataList,
    TuiChevron,
    TuiSelectDirective,
    TuiStringifyPipe,
    CommonModule,
    TuiTextarea,
    TuiButton
  ],
  templateUrl: './second-step.component.html',
  styleUrl: './second-step.component.scss'
})
export class SecondStepComponent {
  secondStepGroup!: FormGroup ;
  minAge = 18;
  maxAge = 100;
  properties =[
    { id: 'smoking', label: 'Не курит' },
    { id: 'alcohol', label: 'Не пьет' },
    { id: 'pets', label: 'Без животных' },  
  ]
  genderOptions = [
    { gender: 'male', label:'Мужской'},
    { gender: 'female', label: 'Женский'},
    { gender:'nogender', label:'Не важно'}
  ];

  constructor(
    private fb: FormBuilder, 
    private cityService: CityApiService,
  ){}

  ngOnInit(){
    this.secondStepGroup= this.fb.group({
      properties: [[], Validators.required],
      coliversGender: ['', Validators.required],
      coliverAge:[[18, 100], Validators.required],
      description:['']
    });
  }

  propertiesStringify: TuiStringHandler<any> = (metro) => this.properties.find((item) => item.id === metro.id)?.label ?? '';
  protected readonly stringifyGenderColivers: TuiStringHandler<string> = (gender) => this.genderOptions.find((item) => item.gender === gender)?.label ?? '';
 

}
