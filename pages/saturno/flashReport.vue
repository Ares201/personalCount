<template>
  <v-card height="100%" tile>
    <v-card-title>
      <v-row>
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <span class="text-h6">Documento F-R</span>
          <v-btn color="primary" small fab dark @click="openDialog">
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            color="green"
            hide-no-data
            hide-selected
            label="Buscar Evento"
            prepend-icon="mdi-database-search"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            color="green"
            hide-no-data
            hide-selected
            label="Estado"
            prepend-icon="mdi-information-outline"
            :items="['Completado', 'Pendiente', 'En Proceso', 'No Solicitado']"
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
          <v-chip :color="returnEstado(item)">{{ item.estado }}</v-chip>
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <v-icon small color="blue" @click="editDocument(item)">mdi-pencil</v-icon>
          <v-icon small color="red" @click="deleteDocument(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card-text>
    <addDocument
      :dialog.sync="dialogComponent"
      @closedialog="closeDialog"
      @saveDocument="fetchDocuments"
      :documents="selectedDocument"
    />
  </v-card>
</template>

<script>
import addDocument from '../../components/addFlashR.vue';
import { getDocuments, deleteDocument } from '../../services/documentServices';

export default {
  name: 'Documents',
  components: { addDocument },
  data() {
    return {
      headers: [
        { text: '#', value: 'index', sortable: false },
        { text: 'Fecha de Envío', value: 'fechaEnvio' },
        { text: 'Fecha de Repuesta', value: 'fechaRepuesta' },
        { text: 'N° Flash Report', value: 'numero' },
        { text: 'Operación', value: 'operacion' },
        { text: 'Evento', value: 'evento' },
        // { text: 'Fecha Solicitud', value: 'fechaSolicitud' },
        { text: 'Operador CC', value: 'operador' },
        // { text: 'Link', value: 'link' },
        { text: 'Estado', value: 'estado' },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ],
      dialogComponent: false,
      documents: [],
      selectedEstado: null,
      selectedOperacion: null,
      selectedDocument: null,
    };
  },
  computed: {
    filteredDocuments() {
      return this.documents.filter(doc => {
        const estadoMatch = !this.selectedEstado || doc.estado === this.selectedEstado;
        const operacionMatch = !this.selectedOperacion || doc.operacion === this.selectedOperacion;
        return estadoMatch && operacionMatch;
      });
    }
  },
  async created() {
    await this.fetchDocuments();
  },
  methods: {
    async fetchDocuments() {
      try {
        const allDocuments = await getDocuments();
        this.documents = allDocuments
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
      console.log('pasa el id', id)
      await deleteDocument(id);
      this.fetchDocuments();
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
    openDialog() {
      this.selectedDocument = null;
      this.dialogComponent = true;
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
