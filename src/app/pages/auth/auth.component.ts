import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { UserApiService } from '../../services/user-api/user-api.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatInputModule, MatFormFieldModule, MatButtonModule, ReactiveFormsModule,],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  authForm = this.formBuilder.group({
    email: ['', 
      {
        validators: [Validators.required, Validators.email],
        updateOn: 'blur'
      }
    ],
    password: ['', 
      {
        validators: [Validators.required],
        updateOn: 'blur'
      }
    ],
  });

  constructor( private formBuilder: FormBuilder, 
              private router: Router,
            private userApiService:UserApiService){}

  auth = () =>{
    this.userApiService.logIn(this.authForm.value)
  }
  navigateToRegistration = () =>{
    this.router.navigate(['/registration']);
  }
}
