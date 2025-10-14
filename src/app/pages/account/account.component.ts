import {Component, ComponentRef, ViewChild, ViewContainerRef} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {TuiTab, TuiTabsVertical} from "@taiga-ui/kit";
import {routes} from "../../app.routes";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule, TuiTabsVertical, TuiTab, CommonModule],
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
    "FAQ",
    "Создать объявление"
  ]
  forms: any;
  selectedTopic = "Моя учетная запись";

  constructor(private router: Router) {}
  ngOnInit(){

    const url = this.router.url;

    if (url.includes('/account/profile')) {
      this.selectedTopic = 'Моя учетная запись';
    } else if (url.includes('/account/privacy')) {
      this.selectedTopic = 'Приватность';
    } else if (url.includes('/account/payment')) {
      this.selectedTopic = 'Оплата';
    } else if (url.includes('/account/support')) {
      this.selectedTopic = 'Поддержка';
    } else if (url.includes('/account/faq')) {
      this.selectedTopic = 'FAQ';
    }else if (url.includes('/account/newad')) {
      this.selectedTopic = 'Создать объявление';
    }

  }
  
  selectTopic(topic: any){
    this.selectedTopic = topic
    switch (topic){
      case 'Моя учетная запись':
        this.router.navigate(['/account/profile']);
        break;
      case 'Приватность':
        this.router.navigate(['/account/privacy']);
        break;
      case 'Оплата':
        this.router.navigate(['/account/payment']);
        break;
      case 'Поддержка':
        this.router.navigate(['/account/support']);
        break;
      case 'FAQ':
        this.router.navigate(['/account/faq']);
        break;
      case 'Создать объявление':
        this.router.navigate(['/account/newad'])
    }
  }
  selectForm(form:any){}

  toggleSideNav(){
    this.opened = !this.opened
  }
}
