import { Component, Input, input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { CategoriesService, Category } from 'src/app/service/categories-service.service';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
@Input() id: string;

  category: Category


  constructor(private categoryService: CategoriesService, private toastCtrl: ToastController, private modalCtrl: ModalController) {
    
  }

  ngOnInit() {
    console.log(this.id);

    this.categoryService.getCategoryById(this.id).subscribe(categorys => {
      this.category = categorys;
    });
  }


  async updateCategory() {
    this.categoryService.updateCategory(this.category)
    const toast = await this.toastCtrl.create({
      message: 'category updated successfully',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
    this.modalCtrl.dismiss();
  }

  async deleteCategory() {
    this.categoryService.removeCategory(this.category.id);
    const toast = await this.toastCtrl.create({
      message: 'category deleted successfully',
      duration: 2000,
      color: 'danger'
    });
    await toast.present();
    this.modalCtrl.dismiss();
  }

}
