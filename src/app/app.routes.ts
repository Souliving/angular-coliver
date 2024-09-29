import { Routes } from '@angular/router';
import { RegistrationComponent } from './pages/registration/registration.component';
import { AuthComponent } from './pages/auth/auth.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { userGuardGuard } from './user-guard.guard';
import { AccountComponent } from './pages/account/account.component';
import { FavoriteAdsComponent } from './pages/favorite-ads/favorite-ads.component';

export const routes: Routes = [
    {
        path:'registration',
        component:RegistrationComponent,
        
    },
    {
        path:'login',
        component: AuthComponent
    },
    {
        path:'account',
        component: AccountComponent,
        canActivate: [userGuardGuard]
    },
    {
        path:'favorites',
        component: FavoriteAdsComponent,
        canActivate: [userGuardGuard]
    },
    {
        path:'',
        component: MainPageComponent,
    },
    
];
