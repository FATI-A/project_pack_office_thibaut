import { Component, Input } from '@angular/core';
import { ProductsServicesService } from '../service/products-services.service';
import { Product } from '../models/produit';
import { transaction } from '../models/transaction';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; 
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {
  ViewChild,
  AfterViewInit,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { TransactionService } from '../service/transaction.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-tab-transaction',
  imports: [
    MatTableModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
  ],
  templateUrl: './tab-transaction.component.html',
  styleUrl: './tab-transaction.component.scss',
})
export class TabTransactionComponent implements OnInit, AfterViewInit,OnChanges {
  @Input() month: number = 1;
  displayedColumns: string[] = [
    'name',
    'date',
    'quantity_in_stock',
    'priceachat',
    'prixvente',
    'type',
  ];
  constructor(private TransactionService: TransactionService) {}
  dataSource: MatTableDataSource<transaction> =
    new MatTableDataSource<transaction>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.getDataTransactionByMonth();
    console.log('Mois reçu dans app-tab-transaction : ', this.month);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['month']) {
      this.getDataTransactionByMonth();
    }
  }
  getDataTransactionByMonth() {
    this.TransactionService.getTransactions(this.month).subscribe(
      (data) => {
        this.dataSource.data = data;
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération des transactions:',
          error
        );
      }
    );

    this.paginator.pageIndex = 1;
    this.paginator.pageSize = 8;
  }
}