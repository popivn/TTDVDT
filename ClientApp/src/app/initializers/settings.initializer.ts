import { SettingService } from '../services/setting.service';

export function initializeSettings(settingsService: SettingService): () => Promise<any> {
  return () => {
    return new Promise<void>((resolve, reject) => {
      settingsService.getAllSettings().subscribe({
        next: (response) => {
          if (response.success && response.settings) {
            settingsService.setSettingsCache(response.settings);
          }
          resolve();
        },
        error: (error) => {
          // Don't reject to allow app to continue even if settings fail to load
          resolve();
        }
      });
    });
  };
}
