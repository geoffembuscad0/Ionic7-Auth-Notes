import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Subject } from 'rxjs';

/**
 * NotesService - modern wrapper using Angular's inject() function.
 * Optimized for Standalone Ionic-Angular projects.
 */
@Injectable({
  providedIn: 'root'
})
export class NotesService {
  // Using inject() allows us to skip the constructor entirely
  private supabaseService = inject(SupabaseService);

  // Subject to broadcast note updates (optimistic UI + confirmed updates)
  private notesUpdatedSubject = new Subject<{ id: string; title?: string; content?: string }>();
  public notesUpdated$ = this.notesUpdatedSubject.asObservable();

  /**
   * Helper to get the current Supabase client instance.
   */
  private get supabase() {
    return this.supabaseService.getClient();
  }

  /**
   * Internal helper to ensure user is authenticated before DB operations.
   * Reduces code repetition across CRUD methods.
   */
  private async getUserId() {
    const { data: { user }, error } = await this.supabase.auth.getUser();
    if (error || !user) throw new Error('Not authenticated');
    return user.id;
  }

  /**
   * Emit a local note update immediately (optimistic UI).
   */
  emitNoteUpdatedLocally(note: { id: string; title?: string; content?: string }) {
    this.notesUpdatedSubject.next(note);
  }

  /**
   * Create a new note for the current authenticated user.
   */
  async createNote(note: { title: string; content: string }) {
    const userId = await this.getUserId();

    const { data, error } = await this.supabase
      .from('notes')
      .insert([{
        title: note.title,
        content: note.content,
        user_id: userId
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get notes for the current authenticated user, newest first.
   */
  async getNotes() {
    const userId = await this.getUserId();

    const { data, error } = await this.supabase
      .from('notes')
      .select('id, title, content, inserted_at, user_id')
      .eq('user_id', userId)
      .order('inserted_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  /**
   * Get a single note by id.
   */
  async getNote(id: string) {
    const userId = await this.getUserId();

    const { data, error } = await this.supabase
      .from('notes')
      .select('id, title, content, inserted_at, user_id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update a note by id for the current authenticated user.
   */
  async updateNote(id: string, note: { title?: string; content?: string }) {
    const userId = await this.getUserId();

    const { data, error } = await this.supabase
      .from('notes')
      .update({ title: note.title, content: note.content })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    if (data) {
      this.notesUpdatedSubject.next(data);
    }

    return data;
  }
}
