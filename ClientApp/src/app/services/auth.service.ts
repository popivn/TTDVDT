import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserInfo {
  name: string;
  email: string;
}
export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  userId?: number;
}

export interface ValidateTokenResponse {
  success: boolean;
  message?: string;
  userId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'api/auth';
  private readonly TOKEN_KEY = 'token';

  private getUserInfo(): Observable<UserInfo | null> {
    const token = this.getToken();
    
    if (!token) {
      return of(null);
    }

    try {
      const decoded: any = jwtDecode(token);
      
      const userInfo: UserInfo = {
        name: decoded.name || 
              decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 
              null,
        email: decoded.email || 
               decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || 
               null
      };
      
      return of(userInfo);
    } catch (error) {
      return of(null);
    }
  }
  getUserName(): Observable<string | null> {
    return this.getUserInfo().pipe(
      map(userInfo => userInfo?.name || null)
    );
  }
  getUserEmail(): Observable<string | null> {
    return this.getUserInfo().pipe(
      map(userInfo => userInfo?.email || null)
    );
  }
  private getApiKeyFromUrl(): string | null {
    // Lấy APIKEY từ query string của URL hiện tại
    // Người dùng phải tự thêm vào URL: /login?APIKEY=13467902 hoặc /register?APIKEY=13467902
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('APIKEY');
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    // Lấy APIKEY từ query string của URL hiện tại
    const apiKey = this.getApiKeyFromUrl();
    if (!apiKey) {
      return throwError(() => ({
        error: {
          success: false,
          message: 'APIKEY parameter is required in URL. Example: /register?APIKEY=13467902'
        }
      }));
    }
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register?APIKEY=${encodeURIComponent(apiKey)}`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    // Lấy APIKEY từ query string của URL hiện tại
    const apiKey = this.getApiKeyFromUrl();
    if (!apiKey) {
      return throwError(() => ({
        error: {
          success: false,
          message: 'APIKEY parameter is required in URL. Example: /login?APIKEY=POPIHANDSOMEBABY'
        }
      }));
    }
    return this.http.post<LoginResponse>(`${this.apiUrl}/login?APIKEY=${encodeURIComponent(apiKey)}`, request);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  validateToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return of(false);
    }

    return this.http.get<ValidateTokenResponse>(`${this.apiUrl}/validate`).pipe(
      map(response => response.success === true),
      catchError(() => of(false))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }
}

