import {inject, Injectable, OnInit, signal} from '@angular/core';
import {Meta} from "@angular/platform-browser";
import {LocalStorageService} from "./localStorage/local-storage.service";
import {DOCUMENT} from "@angular/common";

export enum Theme {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

const THEME_STORAGE_KEY = 'theme';
const DARK_THEME_QUERY = '(prefers-color-scheme: dark)';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _meta = inject(Meta);
  private _localStorage = inject(LocalStorageService)
  private _document = inject(DOCUMENT);

  isDark = signal<boolean>(false);
  currentTheme = signal(Theme.System)

  systemHasDarkTheme = matchMedia(DARK_THEME_QUERY).matches;

  init() {
    matchMedia(DARK_THEME_QUERY).addEventListener('change', () => {
      this.systemHasDarkTheme = matchMedia(DARK_THEME_QUERY).matches;
      this.updateTheme();
    });

    const storageTheme = this._localStorage.get(THEME_STORAGE_KEY) as Theme;
    if (Object.values(Theme).includes(storageTheme)) {
      this.currentTheme.set(storageTheme as Theme);
    }
    this.updateTheme();
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    this._localStorage.set(THEME_STORAGE_KEY, this.currentTheme());
    this.updateTheme();
  }

  private updateTheme(): void {
    this.isDark.set((this.currentTheme() === Theme.System && this.systemHasDarkTheme) || this.currentTheme() === Theme.Dark);
    if (this.isDark()) {
      this._document.documentElement.classList.add(Theme.Dark);
      this._meta.updateTag({name: 'color-scheme', content: 'dark'});
    } else {
      this._document.documentElement.classList.remove(Theme.Dark);
      this._meta.updateTag({name: 'color-scheme', content: 'light'});
    }
  }
}
