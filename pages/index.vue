<template>
  <v-card height="100%" tile>
    <v-card-title>
      <span class="text-h6">Gráficos de Finanzas</span>
      <v-spacer />
    </v-card-title>
    <BarChart :chart-data="chartData" :options="chartOptions" />
  </v-card>
</template>

<script>
import BarChart from '../components/chart/Barchart'
import { getBoxs } from '../services/boxServices'

export default {
  components: {
    BarChart
  },
  data() {
    return {
      boxs: [],
      chartData: {
        datasets: [
          {
            label: 'Resumen Financiero',
            data: [0, 0, 0],
            backgroundColor: ['#8ce709', '#f44336', '#2196f3']
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  beforeMount() {
    this.fetchBoxs()
  },
  methods: {
    async fetchBoxs() {
      try {
        const response = await getBoxs()
        this.boxs = response
        // Total de Ingresos
        const totalIngresos = this.boxs
        .filter(item => item.tipo === 'Ingreso')
        .reduce((total, item)=> total + item.monto, 0)
        console.log('totalIngresos:', totalIngresos)
        // Total de Salidas
        const TotalSalidas = this.boxs
        .filter(item => item.tipo === 'Salida')
        .reduce((total, item)=> total + item.monto, 0)
        // Saldo Total
        const SaldoTotal = totalIngresos - TotalSalidas
        this.chartData.datasets[0].data = [totalIngresos, TotalSalidas, SaldoTotal]
        this.chartData.labels = [ `Ingresos - S/. ${totalIngresos}`, `Salidas - S/. ${TotalSalidas}`, `Saldo - S/. ${SaldoTotal}`]
      } catch (error) {
        console.log('Error al obtener los datos:', error)
      }
    }
  }
}
</script>
