<template>
  <v-card height="100%" tile>
    <v-card-title>
      <v-row dense>
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <span class="text-h6">
            <v-icon color="primaryColor" class="mr-3">mdi-mine</v-icon>
            OPERACIONES
          </span>
          <v-btn color="primaryColor" small fab dark @click="dialogComponent= true">
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="searchQuery"
            color="secondaryColor"
            label="Buscar Operacion"
            append-icon="mdi-magnify"
            class="mt-2"
            clearable
            outlined
            dense
            hide-details
          />
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="operations"
        :search="searchQuery"
        item-value="id"
        dense
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <v-icon small color="secondaryColor" @click="editOperationMine(item)">mdi-pencil</v-icon>
          <v-icon small color="dangerColor" @click="deleteOperationMine(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card-text>
    <!-- Componente addOperationMine -->
    <add-operationMine
      :dialog = "dialogComponent"
      @closedialog="closedialog"
      @saveOperationMine="fetchOperationMines"
      :operationMine="selectedOperationMine"
    />
  </v-card>
</template>

<script>
import {  getOperationMines, deleteOperationMine } from '~/services/operationMineServices'
import addOperationMine from '../../components/configuracion/addOperationMine.vue';
export default {
  name: 'Operaciones',
  components:{
    addOperationMine
  },
  data() {
    return {
      headers: [
        { text: 'Nombre', value: 'name', sortable: false },
        { text: 'Distrito', value: 'district', sortable: false },
        { text: 'Departamento', value: 'department', sortable: false },
        { text: 'Estado', value: 'status', sortable: false },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ],
      operations: [],
      search: '',
      dialog: false,
      dialogComponent: false,
      selectedOperationMine: null,
      searchQuery: '',
    }
  },
  computed: {
    filteredHworks() {
      return this.operations.filter(doc => {
        const searchMatch = !this.searchQuery || doc.name.toString().includes(this.searchQuery);
        return searchMatch;
      });
    }
  },
  async beforeMount() {
    await this.fetchOperationMines()
  },
  methods: {
    async fetchOperationMines() {
      try {
        this.operations = await getOperationMines()
      } catch (error) {
        console.error('Error al obtener Registros.', error)
      }
    },
    editOperationMine(operationMine) {
      this.selectedOperationMine = { ...operationMine }
      this.dialogComponent = true
    },
    async deleteOperationMine(operationMineId) {
      if (confirm('¿Estás seguro de eliminar este operacion?')) {
        try {
          await deleteOperationMine(operationMineId)
          await this.fetchOperationMines()
        } catch (error) {
          console.error('Error al eliminar operacion:', error)
        }
      }
    },
    closedialog() {
      this.dialogComponent = false
    },
  },
}
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
}
</style>
