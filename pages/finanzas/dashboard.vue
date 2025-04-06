<template>
  <v-card elevation="2" class="pa-4" height="100%" tile>
    <v-card-title class="d-flex align-center mb-4">
      <h2 class="text-h4">Movimiento de Ahorros</h2>
      <v-spacer />
      <v-select
        v-model="selectedCategory"
        :items="categories"
        label="Categoría"
        class="ml-2"
        style="max-width: 200px"
        color="secondaryColor"
        hide-selected
        hide-no-data
        clearable
        outlined
        dense
        hide-details
      />
    </v-card-title>
    <v-row>
      <v-col cols="12" md="4">
        <v-card
          elevation="1"
          class="pa-4 balance-card"
          :color="getStatusColor"
          :class="{'positive-balance': saldoTotal > 0, 'negative-balance': saldoTotal < 0}"
        >
          <div class="d-flex align-center">
            <v-icon size="36" class="mr-2">
              {{ saldoTotal > 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}
            </v-icon>
            <div>
              <div class="text-h6 mb-1">Saldo Total</div>
              <div class="text-h4">S/. {{ formatNumber(saldoTotal) }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card elevation="1" class="pa-4 income-card" color="secondaryColor">
          <div class="d-flex align-center">
            <v-icon size="36" class="mr-2">mdi-cash-plus</v-icon>
            <div>
              <div class="text-h6 mb-1">Total Ingresos</div>
              <div class="text-h4">S/. {{ formatNumber(totalIngresos) }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card elevation="1" class="pa-4 expense-card" color="dangerColor">
          <div class="d-flex align-center">
            <v-icon size="36" class="mr-2">mdi-cash-minus</v-icon>
            <div>
              <div class="text-h6 mb-1">Total Salidas</div>
              <div class="text-h4">S/. {{ formatNumber(TotalSalidas) }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="8">
        <v-card elevation="1" class="pa-4">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Resumen Financiero</span>
            <v-btn-toggle v-model="chartType" mandatory>
              <v-btn value="bar">
                <v-icon>mdi-chart-bar</v-icon>
              </v-btn>
              <v-btn value="line">
                <v-icon>mdi-chart-line</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-card-title>
          <div style="height: 400px">
            <BarChart ref="barChart" :chart-data="chartData" :options="chartOptions" />
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card elevation="1">
          <v-card-title class="text-center">
            Movimientos por Tipo
          </v-card-title>
          <v-list>
            <v-list-item v-for="(monto, tipo) in countByOperacion" :key="tipo">
              <template v-slot:prepend>
                <v-icon :color="getTipoColor(tipo)" class="mr-2">
                  {{ tipo }}
                </v-icon>
              </template>
              <v-list-item-title class="d-flex justify-space-between">
                <span>{{ tipo }}</span>
                <span :class="tipo === 'Ingreso' || tipo === 'Total' ? 'success--text' : 'error--text'">
                  S/. {{ formatNumber(Math.abs(monto)) }}
                </span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <v-card elevation="1" class="mt-4">
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Historial de Transacciones</span>
        <v-text-field
          v-model="search"
          prepend-icon="mdi-magnify"
          label="Buscar"
          hide-details
          style="max-width: 300px"
        />
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="filteredBoxs"
        :search="search"
        :items-per-page="5"
        class="elevation-0"
      >
        <template v-slot:[`item.tipo`]="{ item }">
            {{ item.tipo }}
        </template>
        <template v-slot:[`item.monto`]="{ item }">
          <span :class="item.tipo === 'Ingreso' ? 'success--text' : 'error--text'">
            S/. {{ formatNumber(item.monto) }}
          </span>
        </template>
        <template v-slot:[`item.fecha`]="{ item }">
          {{ formatDate(item.fecha) }}
        </template>
      </v-data-table>
    </v-card>
  </v-card>
</template>

<script>
import BarChart from '../../components/chart/Barchart'
import { getBoxs } from '../../services/boxServices'

export default {
  components: {
    BarChart
  },
  data() {
    return {
      boxs: [],
      countByOperacion: {},
      selectedCategory: null,
      search: '',
      chartType: 'bar',
      timePeriods: ['Hoy', 'Esta semana', 'Este mes', 'Este año'],
      headers: [
        { title: 'Fecha', value: 'fecha', sortable: false },
        { title: 'Tipo', value: 'tipo', sortable: false, align: 'center' },
        { title: 'Monto', value: 'monto', sortable: false, align: 'center' },
        { title: 'Categoría', value: 'categoria', sortable: false, align: 'center' }
      ],
      chartData: {
        labels: ['Total', 'Ingresos', 'Salidas'],
        datasets: [
          {
            label: 'Resumen Financiero',
            data: [0, 0, 0],
            backgroundColor: ['#2196F3', '#4CAF50', '#F44336'],
            borderColor: ['#1976D2', '#388E3C', '#D32F2F'],
            borderWidth: 1
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw
                return `S/. ${new Intl.NumberFormat('es-PE').format(value)}`
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `S/. ${new Intl.NumberFormat('es-PE').format(value)}`
            }
          }
        }
      }
    }
  },
  computed: {
    filterDocument(){
      return this.boxs.filter(doc => {
        const estadoMatch = !this.selectedCategory || doc.categoria === this.selectedCategory
        return estadoMatch
      })
    },
    filteredBoxs() {
      return this.filterDocument
    },
    categories() {
      return [...new Set(this.boxs.map(t => t.categoria))]
    },
    totalIngresos() {
      return  this.filteredBoxs
        .filter(item => item.tipo === 'Ingreso')
        .reduce((total, item) => total + item.monto, 0)
    },
    TotalSalidas() {
      return  this.filteredBoxs
        .filter(item => item.tipo === 'Salida')
        .reduce((total, item) => total + item.monto, 0)
    },
    TotalCompras() {
      return  this.filteredBoxs
        .filter(item => item.tipo === 'Compra')
        .reduce((total, item) => total + item.monto, 0)
    },
    saldoTotal() {
      return this.totalIngresos - this.TotalSalidas || this.TotalCompras
    },
    getStatusColor() {
      if (this.saldoTotal > 0) return 'info'
      if (this.saldoTotal < 0) return 'primaryColor'
      return 'grey'
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
        this.countByOperacion = this.boxs
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .reduce((acc, doc) => {
          if (doc.tipo && (doc.tipo === "Ingreso" || doc.tipo === "Salida")) {
            acc[doc.tipo] = (acc[doc.tipo] || 0) + doc.monto;
          }
          return acc;
        }, {});
        // Calcular el total (INGRESO - SALIDA)
        this.countByOperacion["Total"] = (this.countByOperacion["Ingreso"] || 0) - (this.countByOperacion["Salida"] || 0);
        // Actualizar datos del gráfico
        this.chartData.datasets[0].data = [this.saldoTotal, this.totalIngresos, this.TotalSalidas]
        this.chartData.labels = [`Total - S/. ${this.formatNumber(this.saldoTotal)}`,
                               `Ingresos - S/. ${this.formatNumber(this.totalIngresos)}`,
                               `Salidas - S/. ${this.formatNumber(this.TotalSalidas)}`]
        // Forzar actualización del gráfico
        this.$nextTick(() => {
          if (this.$refs.barChart && typeof this.$refs.barChart.renderChart === 'function') {
            this.$refs.barChart.renderChart(this.chartData, this.chartOptions)
          }
        })
      } catch (error) {
        console.log('Error al obtener los datos:', error)
      }
    },
    getTipoColor(tipo) {
      const colors = {
        'Ingreso': 'success',
        'Salida': 'error',
        'Total': 'info'
      }
      return colors[tipo] || 'grey'
    },
    formatNumber(number) {
      return new Intl.NumberFormat('es-PE').format(number)
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.balance-card, .income-card, .expense-card {
  position: relative;
  overflow: hidden;
}

.balance-card::before,
.income-card::before,
.expense-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
  pointer-events: none;
}

.positive-balance {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
}

.negative-balance {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
}

.v-data-table {
  border-radius: 8px;
}
</style>