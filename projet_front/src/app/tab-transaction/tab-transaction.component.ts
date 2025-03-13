import { Component } from '@angular/core';
import { ProductsServicesService } from '../service/products-services.service';
import { Product } from '../models/produit';
import { transaction } from '../models/transaction';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; 
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ViewChild, AfterViewInit, OnInit } from '@angular/core';


@Component({
  selector: 'app-tab-transaction',
  imports: [
    MatTableModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './tab-transaction.component.html',
  styleUrl: './tab-transaction.component.scss',
})
export class TabTransactionComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'date',
    'quantityInStock',
    'price',
    'discount',
    'prixVente',
    'typeTransaction',
  ];
  constructor(private productService: ProductsServicesService) {}
  dataSource: MatTableDataSource<transaction> =
    new MatTableDataSource<transaction>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  data: transaction[] = [
    {
      id: 1,
      name: 'Produit A',
      price: 50,
      discount: 10,
      prixVente: 70,
      date: '2025-01-01',
      typeTransaction: 'Achat',
      quantityInStock: 100,
      tig_id: 1,
    },
    {
      id: 2,
      name: 'Produit B',
      price: 30,
      discount: 5,
      prixVente: 50,
      date: '2025-01-05',
      typeTransaction: 'Vente',
      quantityInStock: 200,
      tig_id: 2,
    },
    {
      id: 3,
      name: 'Produit C',
      price: 100,
      discount: 20,
      prixVente: 150,
      date: '2025-01-10',
      typeTransaction: 'Achat',
      quantityInStock: 50,
      tig_id: 3,
    },
    {
      id: 4,
      name: 'Produit D',
      price: 70,
      discount: 15,
      prixVente: 90,
      date: '2025-01-15',
      typeTransaction: 'Vente',
      quantityInStock: 75,
      tig_id: 4,
    },
    {
      id: 5,
      name: 'Produit E',
      price: 80,
      discount: 10,
      prixVente: 100,
      date: '2025-01-20',
      typeTransaction: 'Achat',
      quantityInStock: 300,
      tig_id: 5,
    },
    {
      id: 6,
      name: 'Produit F',
      price: 90,
      discount: 5,
      prixVente: 120,
      date: '2025-01-25',
      typeTransaction: 'Vente',
      quantityInStock: 150,
      tig_id: 6,
    },
    {
      id: 7,
      name: 'Produit G',
      price: 60,
      discount: 12,
      prixVente: 80,
      date: '2025-02-01',
      typeTransaction: 'Achat',
      quantityInStock: 120,
      tig_id: 7,
    },
  ];

  ngOnInit() {
    this.dataSource.data = this.data;
    this.paginator.pageIndex = 1;
    this.paginator.pageSize = 5;
    console.log('Produits transaction :', this.dataSource.data);
  }

  ngAfterViewInit() {
    // Lier le paginator à la source de données après l'initialisation de la vue
    this.dataSource.paginator = this.paginator;
  }
}