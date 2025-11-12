import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthComponent } from '../../pages/auth/auth.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UserApiService } from '../../services/user-api/user-api.service';
import { CommonModule } from '@angular/common';
import {TuiAppBar} from "@taiga-ui/layout";
import {TuiButton, TuiDataList, TuiDropdown, TuiIcon} from "@taiga-ui/core";
import { NotificationComponent } from '../notification/notification.component';
import { TuiAvatar } from '@taiga-ui/kit';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TuiAppBar, TuiButton, TuiDropdown, TuiDataList, TuiIcon, NotificationComponent, TuiAvatar],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  isAuthUser: Observable<any> | undefined;
  protected open = false;

  protected onClick(): void {
    this.open = false;
  }
  constructor(private router: Router, private userApiService:UserApiService ) {}

  ngOnInit(): void {
    this.isAuthUser = this.userApiService.getAuthUser()
  }

  toHome = () =>{
    this.router.navigate(['/']);
  }

  toAccount = () =>{
    this.router.navigate(['/account']);
  }

  toFavorites = () =>{
    this.router.navigate(['/favorites']);
  }

  toChat = () => this.router.navigate(['/chat']);

  toRegistration = () => {
    this.router.navigate(['/registration']);
  }

  toLogin = () => {
    if(this.router.url === '/registration'){
      this.router.navigate(['/']);
    }
    this.dialog.open(AuthComponent, {
      width: '500px',
    });
  }

  logOut() {
    this.userApiService.logOut()
  }
}
