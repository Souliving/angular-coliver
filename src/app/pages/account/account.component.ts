import { Component, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import { AccountInfoComponent } from '../../components/account-info/account-info.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrivatePageComponent } from '../private-page/private-page.component';
import { PayPageComponent } from '../pay-page/pay-page.component';
import { SupportPageComponent } from '../../support-page/support-page.component';
import { FaqPageComponent } from '../faq-page/faq-page.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { CreateFormPageComponent } from '../../create-form-page/create-form-page.component';
@Component({
  selector: 'app-account',
  standalone: true,
  imports: [MatListModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIcon, MatSidenavModule ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  opened: boolean = true;
  topics:string[] = [
    "Моя учетная запись",
    "Приватность",
    "Оплата",
    "Поддержка",
    "FAQ"
  ]
  forms: any;
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
      case 'Приватность':
        this.componentRef = this.infoContainer.createComponent(PrivatePageComponent);
        break;
      case 'Оплата':
        this.componentRef = this.infoContainer.createComponent(PayPageComponent);
        break;
      case 'Поддержка':
        this.componentRef = this.infoContainer.createComponent(SupportPageComponent);
        break;
      case 'FAQ':
        this.componentRef = this.infoContainer.createComponent(FaqPageComponent);
        break;
    }
  }
  selectForm(form:any){}

  toggleSideNav(){
    this.opened = !this.opened
  }

  addNewForm(){
    this.infoContainer.clear();
    this.componentRef = this.infoContainer.createComponent(CreateFormPageComponent);
  }
}
