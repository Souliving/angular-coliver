import {Component, ComponentRef, ViewChild, ViewContainerRef} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {TuiTab, TuiTabsVertical} from "@taiga-ui/kit";
import {routes} from "../../app.routes";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule, TuiTabsVertical, TuiTab],
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

  constructor(private router: Router) {}
  ngOnInit(){

  }
  selectTopic(topic: any){
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
      case 'addNewForm':
        this.router.navigate(['/account/newad'])
    }
  }
  selectForm(form:any){}

  toggleSideNav(){
    this.opened = !this.opened
  }
}
