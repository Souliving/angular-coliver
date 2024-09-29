import { Component, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import {MatListModule} from '@angular/material/list';

import { AccountInfoComponent } from '../../components/account-info/account-info.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-account',
  standalone: true,
  imports: [MatListModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  topics:string[] = [
    "Моя учетная запись",
    "Приватность",
    "Оплата",
    "Поддержка",
    "FAQ"
  ]
  currentTopic: string = ''

  @ViewChild('infoContainer', { read: ViewContainerRef }) infoContainer!: ViewContainerRef;
  componentRef!: ComponentRef<any>;

  constructor() {}
  ngOnInit(){
    
  }

  ngAfterViewInit(){
    this.selectTopic('Моя учетная запись')
  }

  selectTopic(topic: any){
    this.currentTopic = topic;

    this.infoContainer.clear();

    switch (topic){
      case 'Моя учетная запись':
        this.componentRef = this.infoContainer.createComponent(AccountInfoComponent);
        break;
    }
  }
}
