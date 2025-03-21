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
import { MonthlyMarginData } from '../models/MonthlyMarginData';

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
  transactionsData: any[] = [];
  totalChiffreAffaire: number = 0;

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
      this.chart.destroy();
    }

    this.TransactionService.getDailySalesForYear().subscribe(
      (data) => {
        console.log("Données récupérées de l'API Year:", data);
        const monthlyData = this.processApiDataYear(data);
         this.calculateTotalChiffreAffaire(monthlyData);
    
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
                label: "Chiffre d'affaires (€)",
                data: monthlyData,
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
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }


  createChartHebdo(): void {
    const ctx = document.getElementById(
      'chiffreAffaireChart'
    ) as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy();
    }
    this.TransactionService.getDailySalesForWeek().subscribe(
      (data) => {
        console.log("Données récupérées de l'API:", data);

        // Traitement des données pour obtenir les totaux hebdomadaires
        const weeklyData = this.processApiDataHebdo(data);
        this.calculateTotalChiffreAffaire(weeklyData);

        // Création des labels pour les semaines (Semaine 1, Semaine 2, etc.)
        const weekLabels = [
          'Semaine 1',
          'Semaine 2',
          'Semaine 3',
          'Semaine 4',
          'Semaine 5',
        ];

        // Création du graphique avec les données traitées
        this.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: weekLabels, // Labels des semaines
            datasets: [
              {
                label: "Chiffre d'affaires (€)",
                data: weeklyData, // Données hebdomadaires traitées
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
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }

  createChartQuotidien(): void {
    const ctx = document.getElementById(
      'chiffreAffaireChart'
    ) as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy();
    }

    this.TransactionService.getDailySalesForMonth().subscribe(
      (data) => {
        console.log("Données récupérées de l'API:", data);

        const labels = this.getDatesForCurrentMonth();

        const chartData = this.processApiData(data);
        this.calculateTotalChiffreAffaire(chartData);

        this.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: "Chiffre d'affaires (€)",
                data: chartData,
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
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
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

  processApiData(data: any[]): number[] {
    const salesData: number[] = [];

    for (let i = 1; i <= 31; i++) {
      const transaction = data.find((d) => d.day === i);
      salesData.push(transaction ? transaction.total : 0);
    }

    return salesData;
  }

  processApiDataYear(data: any[]): number[] {
    const monthlySales: number[] = [];

    for (let i = 1; i <= 12; i++) {
      const transaction = data.find((d) => d.month === i);
      monthlySales.push(transaction ? transaction.total : 0);
    }
    return monthlySales;
  }

  processApiDataHebdo(data: any[]): number[] {
    const weeklySales: number[] = [];
    for (let i = 1; i <= 5; i++) {
      const weekData = data.find((d) => d.week === i);
      weeklySales.push(weekData ? weekData.total : 0);
    }

    return weeklySales;
  }

  calculateTotalChiffreAffaire(data: number[]): void {
    this.totalChiffreAffaire = data.reduce((acc, value) => acc + value, 0);
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
    this.TransactionService.getMergeForMonth().subscribe(
      (data: MonthlyMarginData) => {
        console.log('dataMerge', data);

        if (
          data &&
          data.marge !== undefined &&
          data.ventes !== undefined &&
          data.achats !== undefined
        ) {
          this.margeMensuelle = data.marge;
          this.ventes = data.ventes;
          this.achats = data.achats;
        } else {
          console.error('Aucune donnée trouvée ou données invalides');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des données', error);
      }
    );
  }
}
