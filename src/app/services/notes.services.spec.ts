import { TestBed } from '@angular/core/testing';

import { NotesServices } from './notes.services';

describe('NotesServices', () => {
  let service: NotesServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotesServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
