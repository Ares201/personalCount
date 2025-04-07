<template>
  <v-card elevation="2" class="pa-4" height="100%" tile>
    <v-card-title class="d-flex align-center mb-4">
      <v-row dense>
        <v-col cols="12" md="8">
          <span class="text-h6">
            <v-icon color="primaryColor" class="mr-3">mdi-cash-multiple</v-icon>
            RESUMEN FINANCIERO
          </span>
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="selectedCategory"
            :items="categories"
            label="Categoría"
            color="secondaryColor"
            hide-selected
            hide-no-data
            clearable
            outlined
            dense
            hide-details
          />
        </v-col>
      </v-row>
    </v-card-title>
    <v-row>
      <v-col cols="12" md="4" v-if="saldoTotal > 0">
        <v-card
          elevation="1"
          class="pa-4 balance-card"
          :style="{ border: '2px solid #546E7A', borderRadius: '10px' }"
        >
          <div class="d-flex align-center">
            <v-icon size="36" class="mr-2">
              {{ saldoTotal > 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}
            </v-icon>
            <div>
              <div class="text-h12 mb-1">Saldo Total</div>
              <div class="text-h8">S/. {{ formatNumber(saldoTotal) }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" v-if="totalIngresos > 0">
        <v-card elevation="1" class="pa-4 income-card" :style="{ border: '2px solid #2E7D32', borderRadius: '10px' }">
          <div class="d-flex align-center">
            <v-icon size="36" class="mr-2">mdi-cash-plus</v-icon>
            <div>
              <div class="text-h12 mb-1">Total Ingresos</div>
              <div class="text-h8">S/. {{ formatNumber(totalIngresos) }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" v-if="TotalSalidas > 0">
        <v-card elevation="1" class="pa-4 expense-card" :style="{ border: '2px solid #E53945', borderRadius: '10px' }">
          <div class="d-flex align-center">
            <v-icon size="36" class="mr-2">mdi-cash-minus</v-icon>
            <div>
              <div class="text-h12 mb-1">Total Salidas</div>
              <div class="text-h8">S/. {{ formatNumber(TotalSalidas) }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-4">
      <v-col cols="12" md="12">
        <v-card elevation="1" class="pa-4">
          <div style="height: 400px">
            <BarChart ref="barChart" :chart-data="chartData" :options="chartOptions" />
          </div>
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
          style="max-width: 200"
        />
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="filteredBoxs"
        :search="search"
        :items-per-page="5"
        class="elevation-0"
        dense
        mobile-breakpoint="0"
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
    filterDocument() {
      return this.boxs.filter(doc => {
        const categoriaMatch = !this.selectedCategory || doc.categoria === this.selectedCategory
        return categoriaMatch;
      });
    },
    filteredBoxs() {
      return this.filterDocument
    },
    categories() {
      return [...new Set(this.boxs.map(t => t.categoria))]
    },
    financialSummary() {
      const ingresos = this.filteredBoxs.filter(item => item.tipo === 'Ingreso');
      const salidas = this.filteredBoxs.filter(item => item.tipo === 'Salida');
      const compras = this.filteredBoxs.filter(item => item.tipo === 'Compra');
      return {
        totalIngresos: ingresos.reduce((total, item) => total + item.monto, 0),
        totalSalidas: salidas.reduce((total, item) => total + item.monto, 0),
        totalCompras: compras.reduce((total, item) => total + item.monto, 0),
        saldoTotal: ingresos.reduce((total, item) => total + item.monto, 0) -
                  salidas.reduce((total, item) => total + item.monto, 0)
      };
    },
    // Accesores más simples
    totalIngresos() {
      return this.financialSummary.totalIngresos;
    },
    TotalSalidas() {
      return this.financialSummary.totalSalidas;
    },
    TotalCompras() {
      return this.financialSummary.totalCompras;
    },
    saldoTotal() {
      return this.financialSummary.saldoTotal;
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
.v-data-table {
  border-radius: 8px;
}
</style>