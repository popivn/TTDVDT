import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Kiểm tra token có tồn tại
  if (!authService.isAuthenticated()) {
    // Lưu returnUrl để redirect sau khi login
    router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url } 
    });
    return false;
  }

  // Validate token với backend
  return authService.validateToken().pipe(
    map(isValid => {
      if (isValid) {
        return true;
      } else {
        // Token không hợp lệ, logout và redirect đến login
        authService.logout();
        router.navigate(['/login'], { 
          queryParams: { returnUrl: state.url } 
        });
        return false;
      }
    }),
    catchError(() => {
      // Lỗi khi validate, logout và redirect đến login
      authService.logout();
      router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url } 
      });
      return of(false);
    })
  );
};

