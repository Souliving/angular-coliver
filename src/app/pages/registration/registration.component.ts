import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UserApiService } from '../../services/user-api/user-api.service';
import { TuiButton, TuiDataList, TuiError, TuiIcon } from '@taiga-ui/core';
import { TuiDataListWrapper, TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { TuiStringHandler } from '@taiga-ui/cdk';
import { TuiInputDateModule, TuiInputModule, TuiInputPasswordModule, TuiSelectModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiButton,
    TuiCardLarge,
    TuiHeader,
    TuiDataList,
    TuiDataListWrapper,
    TuiError,
    TuiFieldErrorPipe,
    TuiIcon,
    TuiInputDateModule,
    TuiInputModule,
    TuiInputPasswordModule,
    TuiSelectModule,
    TuiTextfieldControllerModule
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  constructor(private formBuilder: FormBuilder, private userService: UserApiService) {}

  isFirstStep = true;

  readonly genderOptions = [
    { value: 'FEMALE', label: 'Женщина' },
    { value: 'MALE', label: 'Мужчина' }
  ];

  readonly stringifyGender: TuiStringHandler<{value: string, label: string}> = (item) =>
    item?.label ?? '';

  // Custom validator for minimum age
  private minAgeValidator(minAge: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const birthDate = control.value;
      const today = new Date();
      let age = today.getFullYear() - birthDate.year;

      const monthDiff = today.getMonth() - birthDate.month;
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.day)) {
        age--;
      }

      return age >= minAge ? null : { minAge: { required: minAge, actual: age } };
    };
  }

  registrationForm = this.formBuilder.group({
    firstStep: this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-\(\)]{10,}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    }),

    secondStep: this.formBuilder.group({
      name: ['', Validators.required],
      age: [null, [Validators.required, this.minAgeValidator(18)]],
      gender: ['', Validators.required]
    })
});
ngOnInit(){
 
}

  /* secondStepRegistration = this.formBuilder.group({
    name:[''],
    date: [''],
    gender:[''],
    phone:['']
  }) */

  nextStep = () =>{
    this.isFirstStep = false;
  }

  prevStep = () =>{
    this.isFirstStep = true;
  }

  private calculateAge(birthDate: any): number {
    if (!birthDate) return 0;

    // TuiDay has year, month, day properties
    const birthYear = birthDate.year;
    const birthMonth = birthDate.month;
    const birthDay = birthDate.day;

    const today = new Date();
    let age = today.getFullYear() - birthYear;

    // Check if birthday has occurred this year
    const monthDiff = today.getMonth() - birthMonth;
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDay)) {
      age--;
    }

    return age;
  }

  onSubmit = () =>{
    const firstStep = this.registrationForm.get('firstStep')?.value;
    const secondStep = this.registrationForm.get('secondStep')?.value;
    const genderValue = secondStep?.gender as any;
    const birthDate = secondStep?.age;

    let postData = {
      ...firstStep,
      ...secondStep,
      age: this.calculateAge(birthDate),
      gender: genderValue?.value || genderValue
    };
    this.userService.registration(postData)
      /* .subscribe(
        data => {
          console.log('Данные успешно отправлены:', data);
        },
        error => {
          console.error('Ошибка:', error);
        }
      ); */
  }



  
}
