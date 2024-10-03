import { Component } from '@angular/core';
import { UserApiService } from '../../services/user-api/user-api.service';
import { filter, forkJoin, merge, Observable, tap } from 'rxjs';
import { User, UserData } from '../../data/userStructure';
import {CommonModule} from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { FormsApiService } from '../../services/forms-api/forms-api.service';
@Component({
  selector: 'app-account-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './account-info.component.html',
  styleUrl: './account-info.component.scss'
})
export class AccountInfoComponent {
  user$: Observable<{userData: UserData, photoUrl:string}> | undefined
  formUser!: FormGroup;

  constructor(private userApiService: UserApiService,
    private formsApiService: FormsApiService,
    private fb: FormBuilder
  ){}

  ngOnInit(){
   this.userApiService.getAuthUser().subscribe(user =>{
    console.log(user)
    if(user){

     /*  this.user$ = forkJoin({
        userData: this.userApiService.getUserById(user.jwt.userId),
        photoUrl: this.formsApiService.getUserPhotoByUserId(user.jwt.userId) // Получение URL фото
      }) */
    
        this.userApiService.getUserById(user.jwt.userId).subscribe(data => {
        console.log(data)
        this.initForm(data)
      })
    }

   })
    
  }

  initForm(data: UserData){
    this.formUser = this.fb.group({
      name:[data.name],
      gender:[data.gender],
      email: [data.email],
      age:[data.age]
    });
  }

  saveChanges(){
    console.log(this.formUser)
  }

}
