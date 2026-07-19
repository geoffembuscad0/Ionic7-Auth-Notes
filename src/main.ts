import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { SUPABASE_CONFIG } from './app/app.config';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    // Custom
    {
      provide: SUPABASE_CONFIG,
      useValue: {
        url: 'https://lvhopnndygjficdiewej.supabase.co',
        key: 'sb_publishable_rzfPQZiJ_h-95FP1-zP9kA_HcX9p63-'
      }
    },
  ],
});
