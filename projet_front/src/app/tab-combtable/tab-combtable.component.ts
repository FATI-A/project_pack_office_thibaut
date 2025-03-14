import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  Chart,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  BarController,
} from 'chart.js';
import { TransactionService } from '../service/transaction.service';
import 'chartjs-plugin-annotation';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

Chart.register(
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  BarController
);


@Component({
  selector: 'app-tab-combtable',
  imports: [CommonModule,MatCardModule],
  templateUrl: './tab-combtable.component.html',
  styleUrls: ['./tab-combtable.component.scss'],
})
export class TabCombtableComponent implements OnInit {
  private chart: Chart | undefined;
  margeMensuelle: number = 0;
  ventes: number = 0;
  achats: number = 0;
  marginData: number[] = [];
  trimestersAlerts: string[] = [];
  totalMarge: number = 0;
  benefice: number = 0;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    //this.calculerMargeMensuelle();
    this.generateFakeMarginData();
    this.calculateTotalMarge();
    this.checkNegativeTrimesters(); 
  }

  calculerMargeMensuelle(): void {
    this.transactionService.getMargeMensuelle().subscribe((data) => {
      this.ventes = data.ventes;
      this.achats = data.achats;
      //this.marginData = this.generateMarginData();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createChartAnnuelComptable();
    }, 0);
  }

  createChartAnnuelComptable(): void {
    const ctx = document.getElementById(
      'chiffreAffaireChartCompltable'
    ) as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            label: 'Marge Mensuelle (€)',
            data: this.marginData,
            backgroundColor: this.marginData.map((marge) =>
              marge >= 0 ? 'wheat' : 'red'
            ),
            borderColor: 'black',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  generateFakeMarginData(): void {
    const fakeVentes = [
      1000, 2000, -1500, 1800, -2500, 2100, 2300, 2600, 2700, 2200, 2500, 3000,
    ];
    const fakeAchats = [
      800, 1200, 1000, 1100, 1300, 1400, 1600, 1500, 1700, 1200, 1400, 1600,
    ];

    this.marginData = fakeVentes.map(
      (ventes, index) => ventes - fakeAchats[index]
    );
  }

  calculateTotalMarge(): void {
    //const marginData = [2001, -800, -2500, 700, 1800, -200, 2300, 2600, -700, -2200, -2500, -3000];
    this.totalMarge = this.marginData.reduce(
      (acc, currentValue) => acc + currentValue,
      0
    );
    if (this.totalMarge > 0) {
      this.benefice = this.totalMarge * 0.7;
    } else {
      this.benefice = 0;
    }
  }

  checkNegativeTrimesters(): void {
    const trimesters = [
      { name: 'T1', months: [0, 1, 2] }, // Jan, Feb, Mar
      { name: 'T2', months: [3, 4, 5] }, // Apr, May, Jun
      { name: 'T3', months: [6, 7, 8] }, // Jul, Aug, Sep
      { name: 'T4', months: [9, 10, 11] } // Oct, Nov, Dec
    ];

    this.trimestersAlerts = trimesters.filter(trimestre => {
      const totalMargeTrimestre = trimestre.months
        .map(monthIndex => this.marginData[monthIndex])
        .reduce((acc, current) => acc + current, 0);
      return totalMargeTrimestre < 0;
    }).map(trimestre => trimestre.name);
  }
}
