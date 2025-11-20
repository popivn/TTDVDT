import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  getAllSettings(): Observable<SettingResponse> {
    return this.http.get<SettingResponse>(this.apiUrl);
  }

  getSettingByKey(key: string): Observable<SettingResponse> {
    return this.http.get<SettingResponse>(`${this.apiUrl}/${key}`);
  }

  // Cache settings in memory
  setSettingsCache(settings: { [key: string]: string }): void {
    this.settingsCache = settings;
  }

  getSettingsCache(): { [key: string]: string } | null {
    return this.settingsCache;
  }

  getSettingValue(key: string): string | undefined {
    return this.settingsCache?.[key];
  }
}

