import { Component } from '@angular/core';
import { DetailsProduitsComponent } from '../pages/details-produits/details-produits.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductsServicesService } from '../service/products-services.service';
import { Product } from '../models/produit';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [DetailsProduitsComponent, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
   listeProducts: Product[] = [];
  
  constructor(private productsService: ProductsServicesService, private router: Router) {}
  ngOnInit() {
    this.productsService.getInfoProducts().subscribe((data) => {
      this.listeProducts = data;
      console.log('Produits chargés :', this.listeProducts);
    });
  }


}
