import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, ModalController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/authentication.service';
import { Journal, JournalService } from 'src/app/service/journal-service.service';
import { JournalPage } from '../journal/journal.page';
import { Category, CategoriesService } from 'src/app/service/categories-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-journals',
  standalone: false,
  templateUrl: './journals.page.html',
  styleUrls: ['./journals.page.scss'],
})
export class JournalsPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  userId:any
  title: string
  content: string
  journals: Journal[] = [];
  categories: Category[] = [];
  selectedCategoryId: string;
  filterCategoryId: string = 'all';

  constructor(private authService: AuthenticationService, private journalService: JournalService, private toastCtrl: ToastController, private categoryService: CategoriesService, private modalCtrl: ModalController,
    private route: Router
  ) { }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss('confirm');
    this.addJournal();
  }

  addJournal() {
    this.journalService.addJournal({
      title: this.title,
      content: this.content,
      categoryId: this.selectedCategoryId,
      createdAt: new Date(),
      completed: false
    }).then(async () => {
      const toast = await this.toastCtrl.create({
        message: 'Journal added successfully',
        duration: 2000,
        color: 'success'
      });
      toast.present();
    } ).catch(async (error) => {
      const toast = await this.toastCtrl.create({
        message: 'Error adding journal: ' + error,
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    });
  }

  async openJournal(journal: Journal) {
    const modal = await this.modalCtrl.create({
      component: JournalPage,
      componentProps: { id: journal.id },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.6
    });
    await modal.present();
  }

  ngOnInit() {
    this.authService.getProfile().then(user => {
      this.userId = user.uid;

      // Journals
      this.journalService.getJournal(this.userId).subscribe(res => {
        this.journals = res;
      });

      // Categories
      this.categoryService.getCategory(this.userId).subscribe(res => {
        this.categories = res;
        console.log('Categories:', this.categories);
      });

    }).catch(error => {
      console.error('Error fetching profile:', error);
    });
  }

  toggleCompleted(journal: Journal) {
    journal.completed = !journal.completed;
    this.journalService.updateJournal(journal);
  }

  get filteredJournals() {
    if (this.filterCategoryId === 'all') {
      return this.journals;
    }

    return this.journals.filter(j => j.categoryId === this.filterCategoryId);
  }

  async logout(){
    this.authService.signOut().then(()=>{
      console.log('User signed out successfully.');
      this.route.navigate(['/landing']);
    }).catch((error)=>{
      console.error('Error signing out: ', error);
    });
  }

}
