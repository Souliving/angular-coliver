import { Component, computed, effect, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiDataList, TuiSelect, TuiTextfield } from '@taiga-ui/core';
import { TuiDataListWrapper, TuiDataListWrapperComponent, TuiFilterByInputPipe, TuiInputChip, TuiInputDate, TuiInputNumber, TuiMultiSelect, TuiSelectDirective, TuiStringifyPipe } from '@taiga-ui/kit';
import { CreateNewAdService } from '../../../services/create-new-ad/create-new-ad.service';
import { CommonModule } from '@angular/common';
import { TuiLet, TuiStringHandler } from '@taiga-ui/cdk';
import { City, Subway } from '../../../data/formsStructure';

@Component({
  selector: 'rent-flat-step',
  standalone: true,
  imports: [ReactiveFormsModule, 
    TuiTextfield,
     TuiSelect, 
    TuiDataListWrapperComponent, 
    TuiSelectDirective,
    CommonModule, 
    TuiDataListWrapper,
    TuiSelect,
    TuiDataList,
    TuiInputDate, 
    TuiInputNumber,
    TuiLet,
    TuiInputChip,
    TuiMultiSelect,
    TuiStringifyPipe,
  TuiFilterByInputPipe
],
  templateUrl: './rent-flat-step.component.html',
  styleUrl: './rent-flat-step.component.scss',
})
export class RentFlatStepComponent {
  @Output() nextStep = new EventEmitter<FormGroup>();
  form!: FormGroup;
  citiesComputed = computed(() => this.newAdService.cities());
  metroComputed = computed(() => this.newAdService.metros());
  withColiversOptions = [  
    { id: 1, label: 'Один' },
    { id: 2, label: 'С друзьями' },
    { id: 3, label: 'Семья' },
  ];

  genderOptions = [
    { gender: 'male', label:'Мужской'},
    { gender: 'female', label: 'Женский'},
    { gender:'nogender', label:'Не важно'}
  ];

  constructor(private fb: FormBuilder, private newAdService: CreateNewAdService) {

    effect(() => {
      const { city, metro, ...rest } = this.form.value;
      console.log(city)
/*       this.newAdService.city.set(city);
      this.newAdService.metro.set(metro);
      this.newAdService.updateStep1(rest); */
    })

    
  }

   ngOnInit() {
    this.form= this.fb.group({
      city: [this.newAdService.city() || '', Validators.required],
      metro: [this.newAdService.metro() || [], Validators.required],
      withColivers: [null, Validators.required],
      coliversCount: [1, [Validators.required, Validators.min(1)]],
      coliversGender: [[], Validators.required],

      budget: [null, [Validators.required, Validators.min(0)]],
      moveDate: [null, Validators.required],
    });
    this.cityValue()
    this.metroValue()
  } 

  cityValue(){
    this.form.get('city')?.valueChanges.subscribe((city)=> this.newAdService.setCity(city))
  }

  metroValue(){
    this.form.get('metro')?.valueChanges.subscribe((metro)=> this.newAdService.setMetro(metro))
  }
  
  protected readonly stringify: TuiStringHandler<City> = (city) => this.citiesComputed().find((item) => item.id === city.id)?.name ?? '';

  protected readonly metroName: TuiStringHandler<Subway> = (metro) => this.metroComputed().find((item) => item.id === metro.id)?.name ?? '';
  protected readonly stringifyWithColivers :  TuiStringHandler<number> = (id) => this.withColiversOptions.find((item) => item.id === id)?.label ?? '';
  protected readonly stringifyGenderColivers: TuiStringHandler<string> = (gender) => this.genderOptions.find((item) => item.gender === gender)?.label ?? '';
  protected onStep(step: number, formField:string): void {
      const currentValue = this.form.get(formField)?.value ?? 0;
      const newValue = currentValue + step;
      this.form.get(formField)?.setValue(newValue);  
  }

  submitForm(){
    this.nextStep.emit(this.form)
  }
}
