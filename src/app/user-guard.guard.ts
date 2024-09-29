import { CanActivateFn } from '@angular/router';


export const userGuardGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('user');
  console.log(token)
    if (token) {
      // Пользователь авторизован
      return true;
    } else {
      // Пользователь не авторизован, перенаправляем на страницу логина
    //  this.router.navigate(['/login']);
      return false;
    }
  }

