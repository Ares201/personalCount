<template>
  <v-card height="100%" tile>
    <v-card-title>
      <v-row dense>
        <v-col cols="12" md="12" class="d-flex justify-space-between align-center mb-4">
          <span class="text-h6">
            <v-icon color="primaryColor" class="mr-3">mdi-calendar-clock</v-icon>
            EVENTOS - DIFUSIONES
          </span>
          <v-switch
            color="primaryColor"
            @click="switchMode"
            :label="model ? 'Tarjeta' : 'Tabla'"
          ></v-switch>
          <v-btn color="primaryColor" small fab dark @click="openNewEvent">
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="searchQueryGeneral"
            color="secondaryColor"
            label="Buscar..."
            append-icon="mdi-magnify"
            clearable
            outlined
            dense
            hide-details
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            v-model="selectedOperacion"
            color="secondaryColor"
            :items="operations"
            append-icon="mdi-mine"
            label="Operacion"
            item-text="name"
            clearable
            outlined
            dense
            hide-no-data
            hide-selected
            hide-details
          ></v-autocomplete>
        </v-col>
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
                color="secondaryColor"
                v-bind="attrs"
                v-on="on"
                readonly
                clearable
                outlined
                dense
                hide-details
              ></v-text-field>
            </template>
            <v-date-picker color="secondaryColor" v-model="fechaFiltro" @input="menuFecha = false"></v-date-picker>
          </v-menu>
        </v-col>
        <!-- <v-col cols="12" md="3" class="d-flex justify-end">
          <v-btn small color="secondaryColor" dark @click="exportExcel">
            <v-icon left>mdi-microsoft-excel</v-icon>
          </v-btn>
        </v-col> -->
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
          <v-chip
            :color="returnEstado(item).color"
            :text-color="returnEstado(item).text"
            class="ma-1"
          >{{ item.estado }}</v-chip>
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon small color="secondaryColor" @click="editEvent(item)" v-bind="attrs" v-on="on">
                mdi-pencil
              </v-icon>
            </template>
            <span>Editar</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon small color="dangerColor" @click="deleteEvent(item.id)" v-bind="attrs" v-on="on" >
                mdi-delete
              </v-icon>
            </template>
            <span>Eliminar</span>
          </v-tooltip>
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
                    <div><strong>Evento:</strong> {{ event.evento }}</div>
                    <div><strong>Nivel:</strong> {{ event.nivel }}</div>
                    <div><strong>Placa:</strong> {{ event.placaTracto }} / {{ event.placaCarreta }}</div>
                    <div><strong>Fecha:</strong> {{ event.fecha }}</div>
                    <div><strong>Hora:</strong> {{ event.hora }}</div>
                    <div><strong>Estado:</strong> {{ event.estado }}</div>
                    <div><strong>Cámaras:</strong> {{ event.camaras }}</div>
                    <div><strong>Operador:</strong> {{ event.employee.name }}</div>
                    <div><strong>Contrato:</strong> {{ event.contrato }}</div>
                    <div><strong>Ubicación:</strong> {{ event.ubicacion }}</div>
                    <div><strong>Detalles:</strong> {{ event.detalle }}</div>
                    <v-btn color="primary" @click="copyToClipboard(event)">📋 Copiar</v-btn>
                    <v-btn color="success" @click="convertDocument(event)"> Realizar Flash Rª</v-btn>
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
import addEvent from '../../components/saturno/addEvento.vue';
import { getEvents, deleteEvent } from '../../services/eventServices';
import { createDocument } from '../../services/documentServices';
import { getOperationMines } from '../../services/operationMineServices';

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
        { text: 'Placa', value: 'placaTracto' },
        { text: 'Fecha', value: 'fecha' },
        { text: 'Hora', value: 'hora' },
        { text: 'Estado', value: 'estado' },
        { text: 'Operador', value: 'employee.name' },
        { text: 'Contrato', value: 'contrato' },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ],
      operations : [],
      dialogComponent: false,
      menuFecha: false,
      model: false,
      events: [],
      selectedOperacion: null,
      selectedEvent: null,
      searchQueryGeneral: null,
      fechaFiltro: this.getFechaHoy()
    };
  },
  computed: {
    filteredEvents() {
      return this.events.filter(doc => {
        const operacionMatch = !this.selectedOperacion || doc.contrato === this.selectedOperacion;
         // Búsqueda general (si hay searchQueryGeneral)
        const generalSearchMatch = !this.searchQueryGeneral ||
          Object.values(doc).some(value => {
            if (value === null || value === undefined) return false;
            return value.toString().toLowerCase().includes(this.searchQueryGeneral.toLowerCase());
          });
        const fechaMatch = !this.fechaFiltro || doc.fecha === this.fechaFiltro;
        return operacionMatch && generalSearchMatch && fechaMatch;
      });
    }
  },
  async beforeMount() {
    await this.fetchEvents();
    await this.getOperationMines()
  },
  methods: {
    async convertDocument(event) {
      try {
        // 1. Clonamos el objeto sin el ID si está dentro del contenido
        const { id, ...eventData } = event
        // 2. Creamos nuevo documento en la colección 'documents'
        const newDocId = await createDocument({
          ...eventData,
          fechaEnvio: event.fecha,
          estado: 'Pendiente' // ejemplo
        })
        console.log('Documento creado con ID:', newDocId)
      } catch (error) {
        console.error('Error al convertir documento:', error)
      }
    },
    copyToClipboard(event) {
      const formattedText = `
      📢 *CENTRO CONTROL INFORMA*

      *Evento:* ${event.evento}
      *Nivel:* ${event.nivel}🟡
      *Placa:* ${event.placaTracto} / ${event.placaCarreta}
      *Fecha:* ${event.fecha}
      *Hora:* ${event.hora}
      *Estado:* ${event.estado}
      *Cámaras:* ${event.camaras}
      *Operador:* ${event.employee.name}
      *Contrato:* ${event.contrato}
      *Ubicación:* ${event.ubicacion}
      *Detalles:* ${event.detalle}
      `.trim();
      navigator.clipboard.writeText(formattedText).then(() => {
        // alert("Texto copiado, ahora puedes pegarlo en WhatsApp 📲")
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
        placaTracto: '',
        placaCarreta: '',
        fecha: '',
        hora: '',
        estado: '',
        camaras: '',
        employee: '',
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
    async getOperationMines() {
      try {
        this.operations = await getOperationMines()
      } catch (error) {
        console.error('Error al obtener operaciones:', error)
      }
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
      let text = 'default';
      if (item.estado === "Cargado") {
        color = '#D4F8E8',
        text = '#26734D'
      } else if (item.estado === "Vacío") {
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
