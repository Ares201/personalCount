<template>
  <v-card height="100%" tile>
    <v-card-title>
      <span class="text-h6">Graficos ~FR~</span>
      <v-spacer />
    </v-card-title>
    <v-row>
      <v-col cols="12" class="d-flex justify-center align-center">
        <span>Filtros: Por fecha , por operacion , por estado, por usuario, por EVENTO</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <BarChart ref="barChart" :chart-data="chartData" :options="chartOptions" />
      </v-col>
      <v-col cols="12" md="6">
        <v-card outlined>
          <v-card-title class="text-center justify-center">Registros por Operación</v-card-title>
          <v-list>
            <v-list-item v-for="(cantidad, operacion) in countByOperacion" :key="operacion">
              <v-list-item-content>
                <v-list-item-title>
                  {{ operacion }} - {{ cantidad }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import BarChart from '../../components/chart/Barchart'
import { getDocuments } from '../../services/documentServices'

export default {
  components: {
    BarChart
  },
  data() {
    return {
      documents: [],
      countByOperacion: {},
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Cantidad de Documentos',
            data: [],
            backgroundColor: [
              '#8ce709',
              '#f44336',
              '#2196f3',
              '#ff9800',
              '#673ab7',
              '#ffeb3b',
              '#00bcd4',
              '#4caf50'
            ]
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  async beforeMount() {
    await this.fetchDocuments()
  },
  methods: {
    async fetchDocuments() {
      try {
        const response = await getDocuments()
        this.documents = response
        // Contamos registros por operación
        this.countByOperacion = this.documents.reduce((acc, doc) => {
          if (doc.operacion) {
            acc[doc.operacion] = (acc[doc.operacion] || 0) + 1
          }
          return acc
        }, {})
        // Actualizamos los datos del gráfico
        this.chartData.labels = Object.keys(this.countByOperacion)
        this.chartData.datasets[0].data = Object.values(this.countByOperacion)
        // Forzar actualización del gráfico
        this.$nextTick(() => {
          if (this.$refs.barChart && typeof this.$refs.barChart.renderChart === 'function') {
            this.$refs.barChart.renderChart(this.chartData, this.chartOptions)
          }
        })
      } catch (error) {
        console.error('Error al obtener los documentos:', error)
      }
    }
  }
}
</script>
