import { Component } from '@angular/core';
import { UserApiService } from '../../services/user-api/user-api.service';
import {
  forkJoin,
  map,
  Observable,
} from 'rxjs';
import { User, UserData } from '../../data/userStructure';
import {CommonModule} from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FormsApiService } from '../../services/forms-api/forms-api.service';
import {
  TuiDataListWrapperComponent,
  TuiSelectDirective
} from "@taiga-ui/kit";
import {TuiAppearance, TuiButton, TuiTextfield, TuiTitle} from "@taiga-ui/core";
import {TuiCardLarge, TuiForm, TuiHeader} from "@taiga-ui/layout";
import {Gender} from "../../data/formsStructure";
import {TuiSelectModule} from "@taiga-ui/legacy";
@Component({
  selector: 'app-account-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TuiAppearance, TuiCardLarge, TuiForm, TuiHeader, TuiTitle, TuiTextfield, TuiButton, TuiDataListWrapperComponent, TuiSelectDirective, TuiSelectModule],
  templateUrl: './account-info.component.html',
  styleUrl: './account-info.component.scss'
})
export class AccountInfoComponent {
  user$: Observable<{userData: UserData, photoUrl:string}> | undefined
  formUser!: FormGroup;
  genderOptions = Object.values(Gender);
  isChanged = true;

  constructor(private userApiService: UserApiService,
    private formsApiService: FormsApiService,
    private fb: FormBuilder
  ){}

  ngOnInit(){
   this.userApiService.getAuthUser().subscribe(user =>{
   // console.log(user)
    if(user){

      this.user$ = forkJoin({
        userData: this.userApiService.getUserById(user.jwt.userId),
        photoUrl: this.formsApiService.getUserPhotoByUserId(user.jwt.userId) // Получение URL фото
      })
      this.user$.subscribe(data => {
        this.initForm(data.userData)
       // console.log(data)
    })
    }


   })
  }

  initForm(data: UserData){
    console.log(Gender[data.gender as keyof typeof Gender])
    this.formUser = this.fb.group({
      name:[data.name],
      gender: Gender[data.gender as keyof typeof Gender],
      email: [data.email],
      age:[data.age]
    });
  }

  uploadPhoto(event:any){
//  console.log(event)
  let file = <File>event.target.files[0];
  const souceCsvFile = {
    file: file,
    url: URL.createObjectURL(file)
  };
  //console.log(souceCsvFile);
  this.user$ = this.user$?.pipe(
    map(data =>{
      return {
      ...data,
      photoUrl : souceCsvFile.url}
    })
  )
  }

  saveChanges(){

   console.log(this.formUser.value)
  }

}
