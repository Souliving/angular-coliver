import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CityApiService } from '../../../services/city-api/city-api.service';
import {TuiInputRange} from '@taiga-ui/kit';

@Component({
  selector: 'app-second-step',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TuiInputRange 
  ],
  templateUrl: './second-step.component.html',
  styleUrl: './second-step.component.scss'
})
export class SecondStepComponent {
  secondStepGroup!: FormGroup ;
  
  constructor(
    private fb: FormBuilder, 
    private cityService: CityApiService,
){}
  ngOnInit(){
    this.secondStepGroup= this.fb.group({
      properties: [[], Validators.required],
      coliversGender: [[], Validators.required],
      coliverAge:[[], Validators.required],
      description:['']
    });
    }
}
