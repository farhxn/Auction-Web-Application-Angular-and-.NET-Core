import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ScriptLoaderService {
  private loadedScripts = new Set<string>();

  loadScripts(scripts: string[]): void {
    scripts.forEach((src) => {
      if (!this.loadedScripts.has(src)) {
        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        script.async = false;
        document.body.appendChild(script);
        this.loadedScripts.add(src);
      }
    });
  }
}

