import { Component, inject, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import { Router } from '@angular/router';
import { AuthComponent } from '../../pages/auth/auth.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UserApiService } from '../../services/user-api/user-api.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  isAuthUser: Observable<any> | undefined;

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
}
