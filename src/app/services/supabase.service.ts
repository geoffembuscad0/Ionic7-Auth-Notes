import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  // 1. PRIVATE SUBJECT: Holds the current user state
  private _currentUser = new BehaviorSubject<User | null>(null);

  // 2. PUBLIC OBSERVABLE: What the components and guards subscribe to
  currentUser = this._currentUser.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabase.url, environment.supabase.key);
    this.checkUserSession();
  }

  // Check and update the current session state
  async checkUserSession() {
    // The key here is to return the result of the API call
    const { data: { session } } = await this.supabase.auth.getSession();

    // Update the subject
    this._currentUser.next(session?.user ?? null);

    // Set up the listener (only needs to be done once)
    this.supabase.auth.onAuthStateChange((event, session) => {
      this._currentUser.next(session?.user ?? null);
    });

    // You can return the user if you wish, but the primary function is the side effect above.
    return session;
  }

  // Login function
  async signIn({ email, password }: any) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }
  // Add to SupabaseService

  async signUp({ email, password }: { email: string; password: string }) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  // Logout function
  async signOut() {
    await this.supabase.auth.signOut();
    this._currentUser.next(null);
  }
  getClient() {
    return this.supabase;
  }
}
