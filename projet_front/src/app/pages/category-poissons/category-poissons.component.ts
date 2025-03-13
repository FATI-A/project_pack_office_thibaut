import { Component } from '@angular/core';
import { DetailsProduitsComponent } from '../details-produits/details-produits.component';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ProductsServicesService } from '../../service/products-services.service';
import { Product } from '../../models/produit';

@Component({
  selector: 'app-category-poissons',
  imports: [DetailsProduitsComponent, NavbarComponent],
  templateUrl: './category-poissons.component.html',
  styleUrl: './category-poissons.component.scss',
})
export class CategoryPoissonsComponent {
  listeProducts: Product[] = [];
  filteredProducts: Product[] = [];

  constructor(private productsService: ProductsServicesService) {}

  ngOnInit() {
    this.productsService.getInfoProducts().subscribe((data) => {
         this.listeProducts = data.map((product) => ({
           ...product,
           prixVente: 0,
         }));
      console.log('Produits chargés :', this.listeProducts);

      // Filtrer les produits par catégorie (par exemple catégorie 0)
      this.filteredProducts = this.listeProducts.filter(
        (product) => product.category === 0
      );
    });
  }
}
