import { NG_EVENT_PLUGINS } from "@taiga-ui/event-plugins";
import { provideAnimations } from "@angular/platform-browser/animations";
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { UserApiService } from './app/services/user-api/user-api.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';

export function initializeUser(authService: UserApiService) {
  return () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      authService.setAuthUser(JSON.parse(storedUser));
    }
  };
}

bootstrapApplication(AppComponent,{
  ...appConfig,  // Использование существующего appConfig
  providers: [
      provideAnimations(),
    ...appConfig.providers,  // Включаем существующие провайдеры из appConfig
    {
      provide: APP_INITIALIZER,
      useFactory: initializeUser,
      deps: [UserApiService],  // Используем UserApiService для инициализации
      multi: true
    },
    UserApiService,  // Регистрация UserApiService
      NG_EVENT_PLUGINS
]
})
  .catch((err) => console.error(err));
