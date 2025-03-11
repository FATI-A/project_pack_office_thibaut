import { Component } from '@angular/core';
import { ProductsServicesService } from '../../service/products-services.service';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models/produit';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 


@Component({
  selector: 'app-details-produits',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
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
  listeProducts: Product[] = [];
  constructor(private productsService: ProductsServicesService) {}
  ngOnInit() {
    this.productsService.getInfoProducts().subscribe((data) => {
      this.listeProducts = data;
      console.log('Produits chargés :', this.listeProducts);
    });
  }

  getProduit(id: number): Product | undefined {
    return this.listeProducts.find((product) => product.id === id);
  }

  editProduct(product: any) {
    // Logic to edit the product
    console.log('Editing product', product);
  }

  // deleteProduct(product: any) {
  //   // Logic to delete the product
  //   console.log('Deleting product', product);
  //   const index = this.listeProducts.indexOf(product);
  //   if (index > -1) {
  //     this.listeProducts.splice(index, 1);
  //   }
  // }

  // addProduct() {
  //   // Logic to add a new product
  //   console.log('Adding a new product');
  // }
}
