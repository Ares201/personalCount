<template>
  <v-card height="100%" tile>
    <v-card-title>
      <v-row dense>
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <span class="text-h6">Horas Laborales</span>
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
        <v-spacer></v-spacer>
        <v-col cols="12" md="4" class="d-flex justify-end">
          <v-btn color="green" dark @click="exportExcel">
            <v-icon left>mdi-microsoft-excel</v-icon>
            Exportar a Excel
          </v-btn>
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
        <template v-slot:[`item.fechaRepuesta`]="{ item }">
          {{ item.fechaRepuesta ? item.fechaRepuesta : '----/--/--'}}
        </template>
        <template v-slot:[`item.monto`]="{ item }">
          S/.{{ item.monto.toFixed(2) }}
        </template>
        <template v-slot:[`item.estado`]="{ item }">
          <v-chip :color="returnEstado(item)">{{ item.estado }}</v-chip>
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <v-icon small color="blue" @click="editHwork(item)">mdi-pencil</v-icon>
          <v-icon small color="red" @click="deleteHwork(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card-text>
    <addHwork
      :dialog ="dialogComponent"
      @closedialog="closeDialog"
      @saveHwork="fetchHworks"
      :hworks="selectedHwork"
    />
  </v-card>
</template>

<script>
import Swal from "sweetalert2";
import addHwork from '../../components/addFlashR.vue';
import { getHworks, deleteHwork } from '../../services/hworkServices';

export default {
  name: 'Hworks',
  middleware: 'auth',
  components: {
    addHwork
  },
  data() {
    return {
      headers: [
        { text: '#', value: 'index', sortable: false },
        { text: 'Placa', value: 'fechaEnvio' },
        { text: 'Conductor', value: 'numero' },
        { text: 'Operación', value: 'operacion' },
        { text: 'Hora de inicio', value: 'evento' },
        { text: 'Tiempo de Exceso', value: 'operador' },
        { text: 'Estado', value: 'operador' },
        { text: 'Ubicacion', value: 'operador' },
        { text: 'Destino', value: 'operador' },
        { text: 'Condicion', value: 'estado' },
        { text: 'Ruta', value: 'estado' },
        { text: 'Acciones', value: 'acciones', sortable: false }
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
        const estadoMatch = !this.selectedEstado || doc.estado === this.selectedEstado;
        const operacionMatch = !this.selectedOperacion || doc.operacion === this.selectedOperacion;
        const searchMatch = !this.searchQuery || doc.numero.toString().includes(this.searchQuery);
        const fechaMatch = !this.fechaFiltro || doc.fechaEnvio === this.fechaFiltro;
        return estadoMatch && operacionMatch && searchMatch && fechaMatch;
      });
    }
  },
  async beforeMount() {
    await this.fetchHworks();
  },
  methods: {
    openNewHwork() {
      this.selectedHwork = {
        id: null,
        numero: '',
        operacion: '',
        evento: '',
        placaTracto: '',
        placaCarreta:'',
        ubicacion: '',
        fechaEnvio: '',
        fechaRepuesta: '',
        fechaSolicitud: '',
        operador: '',
        link: '',
        estado: ''
      }
      this.dialogComponent = true
    },
    exportExcel(){
      alert('Se esta trabajando...')
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
    returnEstado(item) {
      let color = 'default' // Valor por defecto
      if (item.estado === "Completado") {
        color = 'success'
      } else if (item.estado === "Pendiente") {
        color = 'warning'
      } else if (item.estado === "En Proceso") {
        color = 'orange'
      } else if (item.estado === "No Solicitado"){
        color = 'primary'
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
