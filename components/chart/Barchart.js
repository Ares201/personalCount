// components/BarChart.js
import { Bar  } from 'vue-chartjs';

export default {
  name: 'BarChart',
  extends: Bar ,
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      required: false,
      default: () => ({
        responsive: true,
        maintainAspectRatio: false,
        onClick: (e, elements) => {
          if (elements.length > 0) {
            const firstElement = elements[0];
            const index = firstElement._index; // Propiedad correcta en Chart.js 2
            const label = e.chart.data.labels[index];
            const value = e.chart.data.datasets[0].data[index];
            alert(`Label: ${label}, Value: ${value}`);
          }
        },
      }),
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
