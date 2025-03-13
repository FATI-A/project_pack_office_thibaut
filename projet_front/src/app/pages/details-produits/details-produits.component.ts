import { Component, Input } from '@angular/core';
import { ProductsServicesService } from '../../service/products-services.service';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models/produit';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';





@Component({
  selector: 'app-details-produits',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './details-produits.component.html',
  styleUrl: './details-produits.component.scss',
})
export class DetailsProduitsComponent {
  displayedColumns: string[] = [
    'name',
    'price',
    'sale',
    'discount',
    'quantityInStock',
    'comments',
    'actions',
  ];
  @Input() listeProducts: Product[] = [];

  constructor(private productService: ProductsServicesService) {}

  // Fonction pour modifier un produit
  onEditProduct(product: Product): void {
    console.log('product', product);
    
    this.productService.updateProduct(product.tig_id, product).subscribe(
      (updatedProduct) => {
        console.log('Produit mis à jour:', updatedProduct);
        const index = this.listeProducts.findIndex(
          (p) => p.tig_id === updatedProduct.tig_id
        );
        if (index !== -1) {
          this.listeProducts[index] = updatedProduct;
          this.listeProducts = [...this.listeProducts];
        }
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du produit:', error);
      }
    );
  }
}
