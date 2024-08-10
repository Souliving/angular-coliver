import { Routes } from '@angular/router';
import { RegistrationComponent } from './pages/registration/registration.component';
import { AuthComponent } from './pages/auth/auth.component';
import { MainPageComponent } from './pages/main-page/main-page.component';

export const routes: Routes = [
    {
        path:'registration',
        component:RegistrationComponent
    },
    {
        path:'login',
        component: AuthComponent
    },
    {
        path:'',
        component: MainPageComponent
    }
];
