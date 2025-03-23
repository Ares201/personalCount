<template>
  <v-card height="100%" tile>
    <v-card-title>
      <v-row dense>
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <span class="text-h6">
            <v-icon :color="primaryColor" class="mr-3">mdi-clock-time-eight-outline</v-icon>
            HORAS LABORALES
          </span>
          <v-btn :color="primaryColor" small fab dark @click="openNewHwork">
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="searchQuery"
            :color="secondaryColor"
            label="Buscar Empleado"
            append-icon="mdi-magnify"
            class="mt-2"
            clearable
            outlined
            dense
            hide-details
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            v-model="selectedEstado"
            :color="secondaryColor"
            :items="['income', 'out']"
            label="Ingreso"
            append-icon="mdi-filter-outline"
            class="mt-2"
            clearable
            outlined
            dense
            hide-no-data
            hide-selected
            hide-details
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            v-model="selectedOperacion"
            :color="secondaryColor"
            :items="['CONDESTABLE', 'CEMENTO CL', 'CERRO LINDO', 'ATACOCHA', 'CATALINA HUANCA']"
            append-icon="mdi-mine"
            label="Operacion"
            class="mt-2"
            clearable
            outlined
            dense
            hide-no-data
            hide-selected
            hide-details
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" md="4">
          <v-menu
            v-model="menuFecha"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="fechaFiltro"
                label="Fecha"
                append-icon="mdi-calendar"
                :color="secondaryColor"
                v-bind="attrs"
                v-on="on"
                readonly
                clearable
                outlined
                dense
                hide-details
              ></v-text-field>
            </template>
            <v-date-picker :color="secondaryColor" v-model="fechaFiltro" @input="menuFecha = false"></v-date-picker>
          </v-menu>
        </v-col>
        <!-- <v-col cols="12" md="4">
          <v-text-field
            v-model="fechaFiltro"
            :color="secondaryColor"
            label="Fecha"
            type="date"
            clearable
            outlined
            dense
          ></v-text-field>
        </v-col> -->
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="filteredHworks"
        :search="searchQuery"
        :items-per-page="10"
        class="elevation-1"
        item-value="id"
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
        <template v-slot:[`item.elapsedTime`]="{ item }">
          <v-chip class="mx-4" color="#D3E9F7" text-color="#03416E" label>
            {{ item.elapsedTime || getElapsedTime(item) }}
          </v-chip>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            @click="statusClose(item)"
            :color="returnEstado(item).color"
            :text-color="returnEstado(item).text"
            class="ma-1"
          >
            {{ item.status === 'income' ? 'Ingreso' : 'Salida' }}
          </v-chip>
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <v-icon small :color="secondaryColor" class="mr-2" @click="editHwork(item)">mdi-pencil</v-icon>
          <v-icon small :color="dangerColor" @click="deleteHwork(item.id)">mdi-delete</v-icon>
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
import addHwork from '../../components/saturno/addhorasLaborales.vue';
import { Timestamp } from "firebase/firestore";
import { listenToHworks, deleteHwork, updateHwork } from '../../services/hworkServices';

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
        { text: 'Operacion-Mina', value: 'operationMina', align: 'center' },
        { text: 'Conductor', value: 'employee.name', align: 'center' },
        // { text: 'Jornada', value: 'employee.workHours', align: 'center' },
        { text: 'Hora de inicio', value: 'startTime', align: 'center' },
        { text: 'Hora de salida', value: 'endTime', align: 'center' },
        { text: 'Estado', value: 'status' },
        { text: 'Tiempo de transcurrido', value: 'elapsedTime', align: 'center' },
        { text: 'Acciones', value: 'acciones', sortable: false, align: 'center' }
      ],
      hworks: [],
      selectedOperacion: null,
      selectedEstado: null,
      selectedHwork: null,
      dialogComponent: false,
      menuFecha: false,
      fechaFiltro: this.getFechaHoy(),
      searchQuery: '',
      primaryColor: '#FF8F00',
      secondaryColor: '#2E7D32',
      neutralColor: "#546E7A",
      dangerColor: '#E53945'
    };
  },
  computed: {
    filteredHworks() {
      return this.hworks.filter(doc => {
        const statusMatch = !this.selectedEstado || doc.status === this.selectedEstado;
        const operationMatch = !this.selectedOperacion || doc.operationMina === this.selectedOperacion;
        const searchMatch = !this.searchQuery || doc.employee.name.toString().includes(this.searchQuery);
        const fechaMatch = !this.fechaFiltro || doc.date === this.fechaFiltro;
        return statusMatch && operationMatch && searchMatch && fechaMatch;
      });
    }
  },
  mounted() {
    this.listenToHworks();
  },
  beforeDestroy() {
    // Detener los intervalos individuales
    this.filteredHworks.forEach(item => {
      this.stopElapsedTimeTimer(item);
    });
  },
  methods: {
    listenToHworks() {
      listenToHworks((hworks) => {
        this.hworks = hworks.sort((a, b) => new Date(b.numero) - new Date(a.numero));

        // Iniciar el intervalo para los nuevos elementos
        this.hworks.forEach(item => {
          if (!item.endTime) {
            this.startElapsedTimeTimer(item);
          }
        });
      });
    },
    startElapsedTimeTimer(item) {
      if (!item.endTime) {
        // Limpiar el intervalo anterior si existe
        if (item.intervalId) {
          clearInterval(item.intervalId);
        }

        // Iniciar un nuevo intervalo
        item.intervalId = setInterval(() => {
          // Forzar la reactividad de Vue
          this.$set(item, 'elapsedTime', this.getElapsedTime(item));
        }, 1000); // Actualizar cada segundo
      }
    },
    stopElapsedTimeTimer(item) {
      if (item.intervalId) {
        clearInterval(item.intervalId);
        item.intervalId = null; // Limpiar la referencia
      }
    },
    getElapsedTime(item) {
      if (!item.startTime) return "00:00:00";
      const start = item.startTime.toDate();
      const now = new Date();
      const elapsedMs = now - start; // Diferencia en milisegundos
      const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
      const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    },
    // ... (otros métodos)
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
      listenToHworks((hworks) => {
        this.hworks = hworks.sort((a, b) => new Date(b.numero) - new Date(a.numero));

        // Iniciar el intervalo para los nuevos elementos
        this.hworks.forEach(item => {
          if (!item.endTime) {
            this.startElapsedTimeTimer(item);
          }
        });
      });
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
          const endTime = Timestamp.now();
          const elapsedMs = endTime.toDate() - item.startTime.toDate(); // ✅ Restar directamente
          // Convertir el tiempo transcurrido a HH:mm:ss
          const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));
          const elapsedMinutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
          const elapsedSeconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);
          const elapsedTime = `${elapsedHours.toString().padStart(2, "0")}:${elapsedMinutes.toString().padStart(2, "0")}:${elapsedSeconds.toString().padStart(2, "0")}`;
          // Enviar al backend (Firestore)
          await updateHwork(item.id, {
            endTime: endTime,
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
      if (!timestamp || !timestamp.seconds) return "Laborando...";
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
      let text = 'default';
      if (item.status === "income") {
        color = '#D4F8E8',
        text = '#26734D'
      } else if (item.status === "out") {
        color = '#FFD6D9',
        text = '#A8323E'
      }
      return { color, text }
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
