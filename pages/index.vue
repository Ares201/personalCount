<template>
  <v-card height="100%" tile>
    <v-card-title>
      <!-- <span class="text-h6">Movimiento de Efectivo</span> -->
      <v-spacer />
    </v-card-title>
    <v-row>
      <v-col cols="12" md="6">
        <!-- <BarChart ref="barChart" :chart-data="chartData" :options="chartOptions" /> -->
      </v-col>
    </v-row>
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
        this.chartData.datasets[0].data = [SaldoTotal, totalIngresos, TotalSalidas]
        this.chartData.labels = [ `Total - S/. ${SaldoTotal}`, `Ingresos - S/. ${totalIngresos}`, `Salidas - S/. ${TotalSalidas}`]
        // Forzar actualización del gráfico
        this.$nextTick(() => {
          if (this.$refs.barChart && typeof this.$refs.barChart.renderChart === 'function') {
            this.$refs.barChart.renderChart(this.chartData, this.chartOptions)
          }
        })
      } catch (error) {
        console.log('Error al obtener los datos:', error)
      }
    }
  }
}
</script>
