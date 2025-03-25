<template>
  <v-card height="100%" tile>
    <v-card-title>
      <v-row dense>
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <span class="text-h6">
            <v-icon color="primaryColor" class="mr-3">mdi-file-multiple</v-icon>
            DOCUMENTO F-R
          </span>
          <v-btn color="primaryColor" small fab dark @click="openNewDocument">
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="searchQuery"
            color="secondaryColor"
            label="Buscar N° Flash Report"
            append-icon="mdi-magnify"
            clearable
            outlined
            dense
            hide-details
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            v-model="selectedEstado"
            :items="['Completado', 'Pendiente', 'En Proceso', 'No Solicitado']"
            append-icon="mdi-information-outline"
            label="Estado"
            color="secondaryColor"
            hide-selected
            hide-no-data
            clearable
            outlined
            dense
            hide-details
          ></v-autocomplete>
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
      </v-row>
      <!-- <v-col cols="12" md="4" class="d-flex justify-end">
        <v-btn color="green" dark @click="exportExcel">
          <v-icon left>mdi-microsoft-excel</v-icon>
          Exportar a Excel
        </v-btn>
      </v-col> -->
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="filteredDocuments"
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
          <v-icon small color="secondaryColor" @click="editDocument(item)">mdi-pencil</v-icon>
          <v-icon small color="dangerColor" @click="deleteDocument(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card-text>
    <addDocument
      :dialog ="dialogComponent"
      @closedialog="closeDialog"
      @saveDocument="fetchDocuments"
      :documents="selectedDocument"
    />
  </v-card>
</template>

<script>
import Swal from "sweetalert2";
import addDocument from '../../components/saturno/addFlashR.vue';
import { getDocuments, deleteDocument } from '../../services/documentServices';
import { getOperationMines } from '../../services/operationMineServices';

export default {
  name: 'Documents',
  middleware: 'auth',
  components: {
    addDocument
  },
  data() {
    return {
      headers: [
        { text: '#', value: 'index', sortable: false },
        { text: 'Fecha de Envío', value: 'fechaEnvio' },
        { text: 'N° Flash Report', value: 'numero' },
        { text: 'Operación', value: 'operacion' },
        { text: 'Evento', value: 'evento' },
        // { text: 'Fecha de Repuesta', value: 'fechaRepuesta' },
        { text: 'Operador CC', value: 'operador' },
        // { text: 'Fecha Solicitud', value: 'fechaSolicitud' },
        // { text: 'Link', value: 'link' },
        { text: 'Estado', value: 'estado' },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ],
      dialogComponent: false,
      menuFecha: false,
      documents: [],
      operations : [],
      selectedEstado: null,
      selectedOperacion: null,
      selectedDocument: null,
      searchQuery: null,
      fechaFiltro: this.getFechaHoy()
    };
  },
  computed: {
    filteredDocuments() {
      return this.documents.filter(doc => {
        const estadoMatch = !this.selectedEstado || doc.estado === this.selectedEstado;
        const operacionMatch = !this.selectedOperacion || doc.operacion === this.selectedOperacion;
        const searchMatch = !this.searchQuery || doc.numero.toString().includes(this.searchQuery);
        const fechaMatch = !this.fechaFiltro || doc.fechaEnvio === this.fechaFiltro;
        return estadoMatch && operacionMatch && searchMatch && fechaMatch;
      });
    }
  },
  async beforeMount() {
    await this.fetchDocuments();
    await this.getOperationMines()
  },
  methods: {
    openNewDocument() {
      this.selectedDocument = {
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
    async getOperationMines() {
      try {
        this.operations = await getOperationMines()
      } catch (error) {
        console.error('Error al obtener operaciones:', error)
      }
    },
    async fetchDocuments() {
      try {
        const allDocuments = await getDocuments();
        this.documents = allDocuments.sort((a, b) => new Date(b.numero) - new Date(a.numero));
      } catch (error) {
        console.error('Error al obtener documentos:', error);
      }
    },
    editDocument(document) {
      console.log('Editar', document)
      this.selectedDocument = { ...document };
      this.dialogComponent = true;
    },
    async deleteDocument(id) {
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
          console.log("Eliminando documento con ID:", id);
          await deleteDocument(id);
          await this.fetchDocuments();
          Swal.fire("Eliminado", "El documento ha sido eliminado.", "success");
        } catch (error) {
          console.error("Error al eliminar documento:", error);
          Swal.fire("Error", "No se pudo eliminar el documento.", "error");
        }
      }
    },
    returnEstado(item) {
      let color = "default";
      let text = "default";

      if (item.estado === "Completado") {
        color = "#D4F8E8"; // Verde
        text = "#26734D";
      } else if (item.estado === "Pendiente") {
        color = "#FFD6D9"; // Rojo
        text = "#A8323E";
      } else if (item.estado === "En Proceso") {
        color = "#FFF4C2"; // Amarillo
        text = "#B8860B";
      } else if (item.estado === "No Solicitado") {
        color = "#E0E0E0"; // Gris
        text = "#616161";
      }
      return { color, text };
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
