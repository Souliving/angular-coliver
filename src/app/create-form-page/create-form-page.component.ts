import { Component } from '@angular/core';
import { FormsApiService } from '../services/forms-api/forms-api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserApiService } from '../services/user-api/user-api.service';
import { User } from '../data/userStructure';

@Component({
  selector: 'app-create-form-page',
  standalone: true,
  imports: [],
  templateUrl: './create-form-page.component.html',
  styleUrl: './create-form-page.component.scss'
})
export class CreateFormPageComponent {
  newAdForm: FormGroup | undefined;
  firstStepGroup: FormGroup | undefined;
  secondStepGroup: FormGroup | undefined;
  user: User | null | undefined;
  constructor(
    private formsApiService: FormsApiService,
    private fb: FormBuilder, private userApiService: UserApiService,){}

  ngOnInit(){
   this.user= this.userApiService.getAuthUserValue()
   if(this.user){
    this.firstStepGroup = this.fb.group({
      budget: 0,
      dateMove: '',
      homeTypesIds: [],
    })
      this.newAdForm = this.fb.group({
            userId: this.user.jwt.userId,
            description: "",
            homeTypesIds: [],
            rating: 0,
            reviews: [],
            photoId: null,
            properties: {
              smoking: true,
              alcohol: true,
              petFriendly: true,
              isClean: true,
              homeOwnerId: null
            },
            cityId: null,
            metroIds: [],
            budget: 0,
            dateMove: '',
            onlineDateTime: ""
      })
    }
   
  }

}
