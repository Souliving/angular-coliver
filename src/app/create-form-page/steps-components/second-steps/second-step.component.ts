import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CityApiService } from '../../../services/city-api/city-api.service';
import {TuiChevron, TuiInputChip, TuiInputRange, TuiMultiSelect, TuiRadio, TuiSelectDirective, TuiStringifyPipe, TuiTextarea} from '@taiga-ui/kit';
import {TuiButton, TuiDataList, TuiLabel, TuiSelect, TuiTextfield} from '@taiga-ui/core';
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
    TuiButton,
    TuiRadio,
    TuiLabel
  ],
  templateUrl: './second-step.component.html',
  styleUrl: './second-step.component.scss'
})
export class SecondStepComponent {
  secondStepGroup!: FormGroup ;
  minAge = 18;
  maxAge = 100;

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
      smoking: ['ANY', Validators.required],
      alcohol: ['ANY', Validators.required],
      petFriendly: ['ANY', Validators.required],
      isClean: ['ANY', Validators.required],
      coliversGender: ['', Validators.required],
      coliverAge:[[18, 100], Validators.required],
      description:['']
    });
  }

  protected readonly stringifyGenderColivers: TuiStringHandler<string> = (gender) => this.genderOptions.find((item) => item.gender === gender)?.label ?? '';
 

}
