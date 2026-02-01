import { Component, Input, input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Journal, JournalService } from 'src/app/service/journal-service.service';

@Component({
  selector: 'app-journal',
  standalone: false,
  templateUrl: './journal.page.html',
  styleUrls: ['./journal.page.scss'],
})
export class JournalPage implements OnInit {
@Input() id: string;

  journal:Journal


  constructor(private journalService: JournalService, private toastCtrl: ToastController, private modalCtrl: ModalController) {
    
  }

  ngOnInit() {
    console.log(this.id);

    this.journalService.getJournalById(this.id).subscribe(journals => {
      this.journal = journals;
    });
  }


  async updateJournal() {
    this.journalService.updateJournal(this.journal)
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
