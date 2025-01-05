<template>
  <v-card height="100%" tile>
    <v-card-title>
      <span class="text-h6">Graficos de Finanzas</span>
      <v-spacer />
    </v-card-title>
    <BarChart :chart-data="chartData" :options="chartOptions" />
  </v-card>
</template>

<script>
import BarChart from '../components/chart/Barchart';

export default {
  components: {
    BarChart,
  },
  data() {
    return {
      chartData: {
        labels: ['Ingresos', 'Salidas', 'Efectivo'],
        datasets: [
          {
            label: 'Resumen Financiero',
            data: [2000, 500, 500], // Reemplaza con tus totales
            backgroundColor: ['#8ce709', '#f44336', '#2196f3'],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
};
</script>
