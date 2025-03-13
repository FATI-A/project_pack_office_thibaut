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

  constructor(
    private productsService: ProductsServicesService,
    private router: Router
  ) {}
  ngOnInit() {
    this.productsService.getInfoProducts().subscribe((data) => {
       this.listeProducts = data.map((product) => ({
         ...product,
         prixVente: 0,
       }));
      console.log('Produits chargés :', this.listeProducts);
    });
  }
  onEditProducts(products: Product[]): void {
    console.log('Produits à mettre à jour:', products);
    this.productsService.updateMultiple(products).subscribe(
      (updatedProducts) => {
        console.log('Produits mis à jour:', updatedProducts);
        updatedProducts.forEach((updatedProduct) => {
          const index = this.listeProducts.findIndex(
            (p) => p.tig_id === updatedProduct.tig_id
          );
          if (index !== -1) {
            this.listeProducts[index] = updatedProduct;
          }
        });

        this.listeProducts = [...this.listeProducts];
      },
      (error) => {
        console.error('Erreur lors de la mise à jour des produits:', error);
      }
    );
  }
}
