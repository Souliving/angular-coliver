import { Component, computed, effect } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CityApiService } from '../../../services/city-api/city-api.service';
import { CreateNewAdService } from '../../../services/create-new-ad/create-new-ad.service';
import { CitySubwayComponent } from '../shared/city-subway/city-subway.component';
import { BudgetComponent } from '../shared/budget/budget.component';
import { MovingDateComponent } from '../shared/moving-date/moving-date.component';
import { TuiDataListWrapper, TuiDataListWrapperComponent, TuiInputNumber, TuiSelectDirective, TuiTextarea } from '@taiga-ui/kit';
import { TuiDataList, TuiTextfield } from '@taiga-ui/core';
import { TuiStringHandler } from '@taiga-ui/cdk';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'has-flat-step',
  standalone: true,
  imports: [ 
    CommonModule,
    ReactiveFormsModule,
    CitySubwayComponent,
    BudgetComponent,
    MovingDateComponent,
    TuiTextarea, 
    TuiTextfield,
    TuiInputNumber,
    TuiDataListWrapperComponent,
    TuiDataListWrapper,
    TuiDataList,
    TuiSelectDirective
  ],  
  templateUrl: './has-flat-step.component.html',
  styleUrl: './has-flat-step.component.scss'
})

export class HasFlatStepComponent {
  flatForm!: FormGroup;

  readonly genderList = [
    { gender: 'female', label: 'Женщина' },
    { gender: 'male', label: 'Мужчина' },
    { gender: 'nogender', label: 'И мужчины, и женщины' }
  ];
  
  constructor(
    private fb: FormBuilder, 
    private newAdService: CreateNewAdService
){}
  
 ngOnInit() {
    this.flatForm= this.fb.group({
      city: [this.newAdService.city() || '', Validators.required],
      metro: [this.newAdService.metro() || [], Validators.required],
      address:[null],
      roomsCount:[null, [Validators.required, Validators.min(1)]],
      freeRoomsCount:[null, [Validators.required, Validators.min(0)]],
      coliversCount: [null, [Validators.required, Validators.min(1)]],
      coliversGender: [[], Validators.required],

      budget: [null, [Validators.required, Validators.min(0)]],
      moveDate: [null, Validators.required],
    });

  } 

  
  get cityControl(): FormControl {
  return this.flatForm.get('city') as FormControl;
  }

  get metroControl(): FormControl {
    return this.flatForm.get('metro') as FormControl;
  }

  get budgetControl(): FormControl {
    return this.flatForm.get('budget') as FormControl
  }

  get moveDateControl(): FormControl {
    return this.flatForm.get('moveDate') as FormControl
  }

  protected readonly stringifyGenderColivers: TuiStringHandler<string> = (gender) => this.genderList.find((item) => item.gender === gender)?.label ?? '';

  }
