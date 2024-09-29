import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { UserApiService } from '../../services/user-api/user-api.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, ReactiveFormsModule, MatDatepickerModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  constructor(private formBuilder: FormBuilder, private userService: UserApiService) {}

  isFirstStep = true
  registrationForm = this.formBuilder.group({
    firstStep: this.formBuilder.group({
      email: ['', 
          {
              validators: [Validators.required],//Добавить Validators.email
              updateOn: 'blur'
          }
      ],
      phone: ['', 
          {
              validators: [Validators.required],
              updateOn: 'blur'
          }
      ],
      password: ['', 
          {
              validators: [Validators.required],
              updateOn: 'blur'
          }
      ],
    }),

    secondStep: this.formBuilder.group({
      name: ['', 
        {
            validators: [Validators.required],
            updateOn: 'blur'
        }
      ],      
      age: ['', 
        {
            validators: [Validators.required],
            updateOn: 'blur'
        }
      ],
      gender: ['', 
        {
            validators: [Validators.required],
            updateOn: 'blur'
        }
      ]
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
    console.log(this.registrationForm)

  }
  prevStep = () =>{ this.isFirstStep = true}

  toAge = (date: Date) =>{
    
  }

  onSubmit = () =>{
    let postData = {
      ...this.registrationForm.get('firstStep')?.value,
      ...this.registrationForm.get('secondStep')?.value
    };
    console.log(postData)
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
