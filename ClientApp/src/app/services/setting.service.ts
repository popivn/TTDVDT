import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

export interface SettingItem {
  key: string;
  value: string;
}

export interface SettingResponse {
  success: boolean;
  message: string;
  settings?: { [key: string]: string };
  setting?: SettingItem;
}

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private http = inject(HttpClient);
  private apiUrl = 'api/setting';
  private settingsCache: { [key: string]: string } | null = null;

  // Lấy tất cả settings, dùng cache nếu có
  getAllSettings(): Observable<SettingResponse> {
    if (this.settingsCache) {
      return of({
        success: true,
        message: 'Loaded from cache',
        settings: this.settingsCache
      });
    }
    return this.http.get<SettingResponse>(this.apiUrl).pipe(
      tap(res => {
        if (res && res.success && res.settings) {
          this.settingsCache = res.settings;
        }
      })
    );
  }

  // Lấy setting theo key, dùng cache nếu có
  getSettingByKey(key: string): Observable<SettingResponse> {
    if (this.settingsCache && this.settingsCache[key] !== undefined) {
      return of({
        success: true,
        message: 'Loaded from cache',
        setting: { key, value: this.settingsCache[key] }
      });
    }
    return this.http.get<SettingResponse>(`${this.apiUrl}/${key}`).pipe(
      tap(res => {
        if (
          res && res.success && res.setting
        ) {
          if (!this.settingsCache) {
            this.settingsCache = {};
          }
          this.settingsCache[res.setting.key] = res.setting.value;
        }
      })
    );
  }

  // Lưu cache settings trong bộ nhớ
  setSettingsCache(settings: { [key: string]: string }): void {
    this.settingsCache = settings;
  }

  getSettingsCache(): { [key: string]: string } | null {
    return this.settingsCache;
  }

  getSettingValue(key: string): string | undefined {
    return this.settingsCache?.[key];
  }

  // Tạo mới setting
  createSetting(key: string, value: string): Observable<SettingResponse> {
    return this.http.post<SettingResponse>(this.apiUrl, { key, value }).pipe(
      tap(res => {
        if (res && res.success) {
          // Clear cache để reload
          this.settingsCache = null;
        }
      })
    );
  }

  // Cập nhật setting
  updateSetting(key: string, value: string): Observable<SettingResponse> {
    return this.http.put<SettingResponse>(`${this.apiUrl}/${key}`, { key, value }).pipe(
      tap(res => {
        if (res && res.success) {
          // Update cache
          if (this.settingsCache) {
            this.settingsCache[key] = value;
          } else {
            this.settingsCache = { [key]: value };
          }
        }
      })
    );
  }

  // Xóa setting
  deleteSetting(key: string): Observable<SettingResponse> {
    return this.http.delete<SettingResponse>(`${this.apiUrl}/${key}`).pipe(
      tap(res => {
        if (res && res.success) {
          // Remove from cache
          if (this.settingsCache) {
            delete this.settingsCache[key];
          }
        }
      })
    );
  }
}
