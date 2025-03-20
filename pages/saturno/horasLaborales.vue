<template>
  <v-card height="100%" tile>
    <v-card-title>
      <v-row dense>
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <span class="text-h6"><v-icon class="mr-3">mdi-clock-time-eight-outline</v-icon>Horas Laborales</span>
          <v-btn color="primary" small fab dark @click="openNewHwork">
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="searchQuery"
            color="green"
            label="Buscar N° Flash Report"
            prepend-icon="mdi-magnify"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            color="green"
            hide-no-data
            hide-selected
            label="Estado"
            prepend-icon="mdi-information-outline"
            :items="['Dentro del Lìmite', 'Excedìo Horas', 'Horas Optimas', 'Turno Extendido', 'Sobretiempo Critico']"
            v-model="selectedEstado"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            color="green"
            hide-no-data
            hide-selected
            label="Operacion"
            prepend-icon="mdi-cog-outline"
            :items="['CONDESTABLE', 'CEMENTO CL', 'CERRO LINDO', 'ATACOCHA', 'CATALINA HUANCA']"
            v-model="selectedOperacion"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="fechaFiltro"
            label="Filtrar por fecha de envío"
            prepend-icon="mdi-calendar"
            type="date"
            outlined
            dense
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="filteredHworks"
        item-value="id"
        dense
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.startTime`]="{ item }">
          {{ formatTime(item.startTime) }}
        </template>
        <template v-slot:[`item.endTime`]="{ item }">
          {{ formatTime(item.endTime) }}
        </template>
        <template>
          <v-chip class="mx-4 mt-2 text-h6" color="blue darken-2" label>
            {{ currentTime }}
          </v-chip>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip @click="statusClose(item)" :color="returnEstado(item)" text-color="white" class="ma-1">{{ item.status === 'income' ? 'Ingreso' : 'Salida' }}</v-chip>
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <v-icon small color="blue" @click="editHwork(item)">mdi-pencil</v-icon>
          <v-icon small color="red" @click="deleteHwork(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card-text>
    <addHwork
      :dialog="dialogComponent"
      @closedialog="closeDialog"
      @saveHwork="fetchHworks"
      :hworks="selectedHwork"
    />
  </v-card>
</template>

<script>
import Swal from "sweetalert2";
import addHwork from '../../components/addhorasLaborales.vue';
import { Timestamp } from "firebase/firestore";
import { getHworks, deleteHwork, updateHwork } from '../../services/hworkServices';

export default {
  name: 'Hworks',
  middleware: 'auth',
  components: {
    addHwork
  },
  data() {
    return {
      headers: [
        { text: '#', value: 'index', sortable: false, align: 'center' },
        { text: 'Conductor', value: 'employee.name', align: 'center' },
        { text: 'Jornada', value: 'employee.workHours', align: 'center' },
        { text: 'Hora de inicio', value: 'startTime', align: 'center' },
        { text: 'Hora de salida', value: 'endTime', align: 'center' },
        { text: 'Estado', value: 'status' },
        { text: 'Tiempo de transcurrido', value: 'elapsedTime', align: 'center' },
        { text: 'Acciones', value: 'acciones', sortable: false, align: 'center' }
      ],
      dialogComponent: false,
      hworks: [],
      selectedEstado: null,
      selectedOperacion: null,
      selectedHwork: null,
      searchQuery: null,
      fechaFiltro: this.getFechaHoy()
    };
  },
  computed: {
    filteredHworks() {
      return this.hworks.filter(doc => {
        const statusMatch = !this.selectedEstado || doc.status === this.selectedEstado;
        const operationMatch = !this.selectedOperacion || doc.operation === this.selectedOperacion;
        const searchMatch = !this.searchQuery || doc.numero.toString().includes(this.searchQuery);
        const fechaMatch = !this.fechaFiltro || doc.date === this.fechaFiltro;
        return statusMatch && operationMatch && searchMatch && fechaMatch;
      });
    }
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
  },
  async beforeMount() {
    await this.fetchHworks();
  },
  methods: {
    getElapsedTime(startTime) {
      console.log('funcion', startTime)
      if (!startTime) return "00:00:00"
      const start = startTime.toDate() // Convertir Firestore Timestamp a Date
      const now = new Date()
      const elapsedMs = now - start; // Diferencia en milisegundos
      const hours = Math.floor(elapsedMs / (1000 * 60 * 60))
      const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((elapsedMs % (1000 * 60)) / 1000)
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    },
    updateTime() {
      this.currentTime = new Date().toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    },
    openNewHwork() {
      this.selectedHwork = {
        id: null,
        employee: '',
        startTime: '',
        endTime: '',
        status: '',
        elapsedTime: ''
      }
      this.dialogComponent = true
    },
    getFechaHoy() {
      const hoy = new Date();
      return hoy.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    },
    async fetchHworks() {
      try {
        const allHworks = await getHworks();
        this.hworks = allHworks.sort((a, b) => new Date(b.numero) - new Date(a.numero));
      } catch (error) {
        console.error('Error al obtener hworkos:', error);
      }
    },
    editHwork(hwork) {
      console.log('Editar', hwork)
      this.selectedHwork = { ...hwork };
      this.dialogComponent = true;
    },
    async deleteHwork(id) {
      const confirm = await Swal.fire({
        title: "¿Estás seguro que deseas eliminar?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      });

      if (confirm.isConfirmed) {
        try {
          console.log("Eliminando hworko con ID:", id);
          await deleteHwork(id);
          await this.fetchHworks();
          Swal.fire("Eliminado", "El hworko ha sido eliminado.", "success");
        } catch (error) {
          console.error("Error al eliminar hworko:", error);
          Swal.fire("Error", "No se pudo eliminar el hworko.", "error");
        }
      }
    },
    async statusClose(item) {
      const confirm = await Swal.fire({
        title: "¿Terminar Jornada?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, Terminar",
        cancelButtonText: "Cancelar"
      });
      if (confirm.isConfirmed) {
        try {
          // Capturar la fecha y hora actual como Timestamp de Firestore
          const endTime = Timestamp.now(); // ✅ Firestore Timestamp directo
          // Calcular el tiempo transcurrido (en milisegundos)
          const elapsedMs = endTime.toDate() - item.startTime.toDate(); // ✅ Restar directamente
          // Convertir el tiempo transcurrido a HH:mm:ss
          const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));
          const elapsedMinutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
          const elapsedSeconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);
          const elapsedTime = `${elapsedHours.toString().padStart(2, "0")}:${elapsedMinutes.toString().padStart(2, "0")}:${elapsedSeconds.toString().padStart(2, "0")}`;
          // Enviar al backend (Firestore)
          await updateHwork(item.id, {
            endTime: endTime, // ✅ Guardado como Firestore Timestamp
            elapsedTime: elapsedTime,
            status: "out"
          });
          Swal.fire("Jornada Terminada", "Se ha registrado la hora de salida.", "success");
          await this.fetchHworks();
        } catch (error) {
          console.error("Error al finalizar jornada:", error);
          Swal.fire("Error", "No se pudo guardar la hora de salida.", "error");
        }
      }
    },
    formatTime(timestamp) {
      if (!timestamp || !timestamp.seconds) return "Hora inválida";
      const date = new Date(timestamp.seconds * 1000); // Convertir segundos a milisegundos
      // Obtener la hora, minutos y segundos
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    },
    formatTimestamp(timestamp) {
      if (!timestamp || !timestamp.seconds) return "Fecha inválida";
      const date = new Date(timestamp.seconds * 1000); // Convertir segundos a milisegundos
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Formato 24 horas
      };
      return date.toLocaleString("es-PE", options);
    },
    returnEstado(item) {
      let color = 'default' // Valor por defecto
      if (item.status === "income") {
        color = 'success'
      } else if (item.status === "out") {
        color = 'red'
      }
      return color
    },
    closeDialog() {
      this.dialogComponent = false;
    }
  }
};
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
}
</style>
