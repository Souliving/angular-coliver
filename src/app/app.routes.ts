import { Routes } from '@angular/router';
import { RegistrationComponent } from './pages/registration/registration.component';
import { AuthComponent } from './pages/auth/auth.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { userGuardGuard } from './user-guard.guard';
import { AccountComponent } from './pages/account/account.component';
import { FavoriteAdsComponent } from './pages/favorite-ads/favorite-ads.component';
import { AccountInfoComponent } from './components/account-info/account-info.component';
import { PrivatePageComponent } from './pages/private-page/private-page.component';
import { PayPageComponent } from './pages/pay-page/pay-page.component';
import { SupportPageComponent } from './support-page/support-page.component';
import { FaqPageComponent } from './pages/faq-page/faq-page.component';
import { CreateFormPageComponent } from './create-form-page/create-form-page.component';

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
        path: 'account',
        component: AccountComponent,
        canActivate: [userGuardGuard],
        children: [
            { path: 'profile', component: AccountInfoComponent },
            { path: 'privacy', component: PrivatePageComponent },
            { path: 'payment', component: PayPageComponent },
            { path: 'support', component: SupportPageComponent },
            { path: 'faq', component: FaqPageComponent },
            { path: 'newad', component: CreateFormPageComponent },
            { path: '', redirectTo: 'profile', pathMatch: 'full' }, // по умолчанию - "Моя учетная запись"
        ]
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
