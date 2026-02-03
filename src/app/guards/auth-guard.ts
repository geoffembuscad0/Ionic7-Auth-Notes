import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { map, take, switchMap } from 'rxjs/operators';
import { from } from 'rxjs'; // Import 'from' for converting promises to observables

export const authGuard: CanActivateFn = (route, state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  // 1. Ensure the session check is run and waited for
  // We use switchMap to wait for the checkUserSession promise to resolve
  return from(supabaseService.checkUserSession()).pipe(
    // 2. Now that the session is checked, subscribe to the currentUser Observable
    switchMap(() => supabaseService.currentUser.pipe(
      take(1),
      map(user => {
        // --- LOGIC CHECK ---
        const isLoggedIn = !!user;
        const targetUrl = state.url;
        
        // Scenario 1: Accessing an internal page (like /dashboard)
        if (targetUrl.includes('dashboard')) {
          if (isLoggedIn) {
            return true; // Logged in, allow access
          } else {
            router.navigateByUrl('/login', { replaceUrl: true });
            return false; // Not logged in, redirect to login
          }
        }
        
        // Scenario 2: Accessing the login page (/login)
        if (targetUrl.includes('login') || targetUrl === '/') {
          if (isLoggedIn) {
            router.navigateByUrl('/dashboard', { replaceUrl: true });
            return false; // Logged in, redirect away to dashboard
          } else {
            return true; // Not logged in, allow access to login
          }
        }
        
        // Fallback for other routes
        return true;
      })
    ))
  );
};