import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Получить токен из localStorage
  const userJson = localStorage.getItem('user');

  if (userJson) {
    try {
      const user = JSON.parse(userJson);
      const token = user?.jwt?.token;

      if (token) {
        // Клонировать запрос и добавить Authorization заголовок
        const clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });

        return next(clonedReq);
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
    }
  }

  // Если токена нет, передать запрос без изменений
  return next(req);
};
