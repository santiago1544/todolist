import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { query } from '@angular/animations';
import { Observable } from 'rxjs';


export class Journal {
  id?: string
  userId?: string
  title?: string
  content?: string
  createdAt?: any

  constructor(userId?: string, title?: string, content?: string, createdAt?: any) {
    this.userId = userId;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
  }
}

@Injectable({
  providedIn: 'root',
})
export class JournalService {
  
  userId: any

  constructor(private authService: AuthenticationService, private afs: AngularFirestore) { 
    console.log('Firestore injected:', afs);
    this.authService.getProfile().then(user => {
    this.userId = user?.uid || null;
  });
  }

  async addJournal(journal: Journal) {
    console.log("hola")
    const user = await this.authService.getProfile();
    if (!user) throw new Error('User not logged');

    journal.userId = user.uid;
    journal.createdAt = new Date();

    return this.afs.collection('journals').add(journal);
  }

  getJournal(userId: string): Observable<Journal[]> {
    return this.afs.collection<Journal>('journals', ref =>
      ref.where('userId', '==', userId)
    ).valueChanges({ idField: 'id' });
  }

  getJournalById(id: string): Observable<Journal | undefined> {
    return this.afs.doc<Journal>(`journals/${id}`)
      .valueChanges({ idField: 'id' });
  }

  updateJournal(journal: Journal) {
    return this.afs.doc(`journals/${journal.id}`).update({
      title: journal.title,
      content: journal.content
    });
  }

  removeJournal(id: string) {
    return this.afs.doc(`journals/${id}`).delete();
  }

}
