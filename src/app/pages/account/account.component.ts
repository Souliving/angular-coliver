import { Component, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [MatListModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIcon, MatSidenavModule, RouterModule ],
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
