import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


export class Category {
  id?: string
  userId?: string
  title?: string
  createdAt?: any

  constructor(userId?: string, title?: string, createdAt?: any) {
    this.userId = userId;
    this.title = title;
    this.createdAt = createdAt;
  }
}

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  
  userId: any

  constructor(private authService: AuthenticationService, private afs: AngularFirestore) { 
    console.log('Firestore injected:', afs);
    this.authService.getProfile().then(user => {
      this.userId = user?.uid || null;
    });
  }

  async addCategory(category: Category) {
    console.log("hola")
    const user = await this.authService.getProfile();
    if (!user) throw new Error('User not logged');

    category.userId = user.uid;
    category.createdAt = new Date();

    return this.afs.collection('categories').add(category);
  }

  getCategory(userId: string): Observable<Category[]> {
    return this.afs.collection<Category>('categories', ref =>
      ref.where('userId', '==', userId)
    ).valueChanges({ idField: 'id' });
  }

  getCategoryById(id: string): Observable<Category | undefined> {
    return this.afs.doc<Category>(`categories/${id}`)
      .valueChanges({ idField: 'id' });
  }

  updateCategory(category: Category) {
    return this.afs.doc(`categories/${category.id}`).update({
      title: category.title
    });
  }

  removeCategory(id: string) {
    return this.afs.doc(`categories/${id}`).delete();
  }


}
