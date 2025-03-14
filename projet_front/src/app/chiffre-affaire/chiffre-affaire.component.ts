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
  TimeScale,
} from 'chart.js';
import { NavbarComponent } from '../navbar/navbar.component';
import { TabTransactionComponent } from '../tab-transaction/tab-transaction.component';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../service/transaction.service';
import { MatCardModule } from '@angular/material/card';
import { TabCombtableComponent } from '../tab-combtable/tab-combtable.component';
import { CommonModule } from '@angular/common';

// Enregistrer les composants nécessaires
Chart.register(
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  BarController,
  TimeScale 
);

@Component({
  selector: 'app-chiffre-affaire',
  imports: [
    NavbarComponent,
    TabTransactionComponent,
    FormsModule,
    MatCardModule,
    TabCombtableComponent,
    CommonModule,
  ],
  templateUrl: './chiffre-affaire.component.html',
  styleUrls: ['./chiffre-affaire.component.css'],
})
export class ChiffreAffaireComponent implements OnInit, AfterViewInit {
  private chart: Chart | undefined;
  selectedMonth: number = 1;
  margeMensuelle: number = 0;
  ventes: number = 0;
  achats: number = 0;
  constructor(private TransactionService: TransactionService) {}

  ngOnInit(): void {
    this.onMonthChange();
    this.calculerMargeMensuelle();
  }

  onMonthChange(): void {
    console.log('Mois sélectionné:', this.selectedMonth);
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createChartAnnuel();
    }, 0);
  }

  createChartAnnuel(): void {
    const ctx = document.getElementById(
      'chiffreAffaireChart'
    ) as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy(); // Détruire l'ancien graphique
    }

    this.chart = new Chart(ctx, {
      type: 'bar', // Type du graphique (ici un graphique à barres)
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
        ], // Mois de l'année
        datasets: [
          {
            label: "Chiffre d'affaires (€)", // Légende du dataset
            data: this.generateFakeDataAnnuel(), // Données fictives pour l'année
            backgroundColor: 'wheat',
            borderColor: 'wheat',
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

  createChartHebdo(): void {
    const ctx = document.getElementById(
      'chiffreAffaireChart'
    ) as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Semaine 1',
          'Semaine 2',
          'Semaine 3',
          'Semaine 4',
          'Semaine 5',
        ],
        datasets: [
          {
            label: "Chiffre d'affaires (€)",
            data: this.generateFakeDataHebdo(),
            backgroundColor: 'wheat',
            borderColor: 'wheat',
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

  createChartQuotidien(): void {
    const ctx = document.getElementById(
      'chiffreAffaireChart'
    ) as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.getDatesForCurrentMonth(), // Utiliser les dates du mois
        datasets: [
          {
            label: "Chiffre d'affaires (€)",
            data: this.generateFakeDataQuotidien(),
            backgroundColor: 'wheat',
            borderColor: 'wheat',
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

  // Générer des données fictives pour l'année (par mois)
  generateFakeDataAnnuel(): number[] {
    const fakeData = [];
    for (let i = 0; i < 12; i++) {
      fakeData.push(Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000);
    }
    return fakeData;
  }

  // Générer des données fictives pour la semaine
  generateFakeDataHebdo(): number[] {
    const fakeData = [];
    for (let i = 0; i < 5; i++) {
      // 5 semaines
      fakeData.push(Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000);
    }
    return fakeData;
  }

  // Générer des données fictives pour les jours
  generateFakeDataQuotidien(): number[] {
    const fakeData = [];
    for (let i = 0; i < 31; i++) {
      // 31 jours
      fakeData.push(Math.floor(Math.random() * (5000 - 500 + 1)) + 500);
    }
    return fakeData;
  }

  getDatesForCurrentMonth(): string[] {
    const currentDate = new Date();
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    let dates = [];
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(`${i}/${currentDate.getMonth() + 1}`);
    }
    return dates;
  }

  calculerMargeMensuelle(): void {
    this.TransactionService.getMargeMensuelle().subscribe((data) => {
      this.margeMensuelle = data.marge;
      this.ventes = data.ventes;
      this.achats = data.achats;
    });
  }
}
