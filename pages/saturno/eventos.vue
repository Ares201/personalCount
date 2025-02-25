<template>
  <v-card height="100%" tile>
    <v-card-title>
      <v-row dense>
        <v-col cols="12" md="12" class="d-flex justify-space-between align-center mb-4">
          <span class="text-h6">Eventos Diarios</span>
          <v-switch
            @click="switchMode"
            :label="model ? 'Tarjeta' : 'Tabla'"
          ></v-switch>
          <v-btn color="primary" small fab dark @click="openNewEvent">
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="searchQuery"
            color="green"
            label="Buscar Evento"
            prepend-icon="mdi-magnify"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
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
        <v-col cols="12" md="3">
          <v-text-field
            v-model="fechaFiltro"
            label="Filtrar por fecha de envío"
            prepend-icon="mdi-calendar"
            type="date"
            outlined
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3" class="d-flex justify-end">
          <v-btn small color="green" dark @click="exportExcel">
            <v-icon left>mdi-microsoft-excel</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text v-if="model">
      <v-data-table
        :headers="headers"
        :items="filteredEvents"
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
          <v-icon small color="blue" @click="editEvent(item)">mdi-pencil</v-icon>
          <v-icon small color="red" @click="deleteEvent(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card-text>
    <v-row v-else>
      <v-col cols="12" sm="12">
        <v-row>
          <v-col v-for="event in filteredEvents" :key="event.id" cols="12" sm="6" md="4">
            <v-card
              class="pa-2 mb-4" style="border: 2px solid orange; border-radius: 10px;"
            >
             <v-row dense>
                <v-col cols="12">
                  <v-card-text class="event-details">
                    <h3 class="mb-6"> 📢 CENTRO CONTROL INFORMA</h3>
                    <v-btn color="primary" @click="copyToClipboard(event)">📋 Copiar</v-btn>
                    <div><strong>Evento:</strong> {{ event.evento }}</div>
                    <div><strong>Nivel:</strong> {{ event.nivel }}</div>
                    <div><strong>Placa:</strong> {{ event.placa }}</div>
                    <div><strong>Fecha:</strong> {{ event.fecha }}</div>
                    <div><strong>Hora:</strong> {{ event.hora }}</div>
                    <div><strong>Estado:</strong> {{ event.estado }}</div>
                    <div><strong>Cámaras:</strong> {{ event.camaras }}</div>
                    <div><strong>Operador:</strong> {{ event.operador }}</div>
                    <div><strong>Contrato:</strong> {{ event.contrato }}</div>
                    <div><strong>Ubicación:</strong> {{ event.ubicacion }}</div>
                    <div><strong>Detalles:</strong> {{ event.detalle }}</div>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <addEvent
      :dialog ="dialogComponent"
      @closedialog="closeDialog"
      @saveEvent="fetchEvents"
      :events="selectedEvent"
    />
  </v-card>
</template>

<script>
import Swal from "sweetalert2";
import addEvent from '../../components/addEvento.vue';
import { getEvents, deleteEvent } from '../../services/eventServices';

export default {
  name: 'Events',
  middleware: 'auth',
  components: {
    addEvent
  },
  data() {
    return {
      headers: [
        { text: '#', value: 'index', sortable: false },
        { text: 'Evento', value: 'evento' },
        { text: 'Placa', value: 'placa' },
        { text: 'Fecha', value: 'fecha' },
        { text: 'Hora', value: 'hora' },
        { text: 'Estado', value: 'estado' },
        { text: 'Operador', value: 'operador' },
        { text: 'Contrato', value: 'contrato' },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ],
      dialogComponent: false,
      model: false,
      events: [],
      selectedOperacion: null,
      selectedEvent: null,
      searchQuery: null,
      fechaFiltro: this.getFechaHoy()
    };
  },
  computed: {
    filteredEvents() {
      return this.events.filter(doc => {
        const operacionMatch = !this.selectedOperacion || doc.contrato === this.selectedOperacion;
        const searchMatch = !this.searchQuery || doc.evento.toString().includes(this.searchQuery);
        const fechaMatch = !this.fechaFiltro || doc.fecha === this.fechaFiltro;
        return operacionMatch && searchMatch && fechaMatch;
      });
    }
  },
  async beforeMount() {
    await this.fetchEvents();
  },
  methods: {
    copyToClipboard(event) {
      const formattedText = `
      📢 *CENTRO CONTROL INFORMA*

      *Evento:* ${event.evento}
      *Nivel:* ${event.nivel}🟡
      *Placa:* ${event.placa}
      *Fecha:* ${event.fecha}
      *Hora:* ${event.hora}
      *Estado:* ${event.estado}
      *Cámaras:* ${event.camaras}
      *Operador:* ${event.operador}
      *Contrato:* ${event.contrato}
      *Ubicación:* ${event.ubicacion}
      *Detalles:* ${event.detalle}
      `.trim();
      navigator.clipboard.writeText(formattedText).then(() => {
        alert("Texto copiado, ahora puedes pegarlo en WhatsApp 📲");
      }).catch(err => {
        console.error("Error al copiar: ", err);
      });
    },
    switchMode(){
      this.model = !this.model
    },
    openNewEvent() {
      this.selectedEvent = {
        id: null,
        evento: '',
        nivel: '',
        placa: '',
        fecha: '',
        hora: '',
        estado: '',
        camaras: '',
        operador: '',
        contrato: '',
        ubicacion: '',
        detalle: ''
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
    async fetchEvents() {
      try {
        const allEvents = await getEvents();
        this.events = allEvents.sort((a, b) => new Date(b.numero) - new Date(a.numero));
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      }
    },
    editEvent(event) {
      console.log('Editar', event)
      this.selectedEvent = { ...event };
      this.dialogComponent = true;
    },
    async deleteEvent(id) {
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
          console.log("Eliminando evento con ID:", id);
          await deleteEvent(id);
          await this.fetchEvents();
          Swal.fire("Eliminado", "El evento ha sido eliminado.", "success");
        } catch (error) {
          console.error("Error al eliminar evento:", error);
          Swal.fire("Error", "No se pudo eliminar el evento.", "error");
        }
      }
    },
    returnEstado(item) {
      let color = 'default' // Valor por defecto
      if (item.estado === "Cargado") {
        color = 'success'
      } else if (item.estado === "Vacío") {
        color = 'orange'
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
.event-details {
  display: flex;
  flex-direction: column;
  gap: 4px; /* Espaciado entre líneas */
  font-size: 16px;
}
.event-details div {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
</style>
