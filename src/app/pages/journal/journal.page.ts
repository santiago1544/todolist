import { Component, Input, input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Journal, JournalService } from 'src/app/service/journal-service.service';
import { Category, CategoriesService } from 'src/app/service/categories-service.service';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-journal',
  standalone: false,
  templateUrl: './journal.page.html',
  styleUrls: ['./journal.page.scss'],
})
export class JournalPage implements OnInit {
@Input() id: string;

  journal:Journal
  categories: Category[] = [];
  selectedCategoryId: string;

  constructor(private authService: AuthenticationService, private journalService: JournalService, private toastCtrl: ToastController, private modalCtrl: ModalController, private categoryService: CategoriesService) {}

  ngOnInit() {

    this.authService.getProfile().then(user => {
      this.categoryService.getCategory(user.uid).subscribe(res => {
        this.categories = res;
      });
    });

    this.journalService.getJournalById(this.id).subscribe(journal => {
      this.journal = journal;
      this.selectedCategoryId = journal?.categoryId;
    });
  }


  async updateJournal() {
    this.journal.categoryId = this.selectedCategoryId;

    await this.journalService.updateJournal(this.journal);

    const toast = await this.toastCtrl.create({
      message: 'Journal updated successfully',
      duration: 2000,
      color: 'success'
    });

    await toast.present();
    this.modalCtrl.dismiss();
  }


  async deleteJournal() {
    this.journalService.removeJournal(this.journal.id);
    const toast = await this.toastCtrl.create({
      message: 'Journal deleted successfully',
      duration: 2000,
      color: 'danger'
    });
    await toast.present();
    this.modalCtrl.dismiss();
  }

}
