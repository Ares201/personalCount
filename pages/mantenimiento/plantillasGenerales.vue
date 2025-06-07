<template>
  <v-card height="100%" tile>
    <v-card-title>
      <v-row dense>
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <span class="text-h6">
            <v-icon color="primaryColor" class="mr-3">mdi-truck</v-icon>
            PLANTILLAS GENERALES
          </span>
          <v-btn color="primaryColor" small fab dark @click="dialogComponent= true">
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="searchQuery"
            color="secondaryColor"
            label="Buscar Plantilla"
            append-icon="mdi-magnify"
            class="mt-2"
            clearable
            outlined
            dense
            hide-details
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="searchQuery"
            :items="plantillasList"
            label="Filtrar por"
            color="secondaryColor"
            class="mt-2"
            outlined
            dense
            hide-details
            clearable
          >
          </v-select>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="plantillas"
        :search="searchQuery"
        item-value="id"
        dense
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <v-icon small color="secondaryColor" @click="editPlantilla(item)">mdi-pencil</v-icon>
          <v-icon small color="dangerColor" @click="deletePlantilla(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card-text>
    <!-- Componente addPlantilla -->
    <add-plantilla
      :dialog = "dialogComponent"
      @closedialog="closedialog"
      @savePlantilla="fetchPlantillas"
      :plantilla="selectedPlantilla"
    />
  </v-card>
</template>

<script>
import Swal from 'sweetalert2'
import {  getPlantillas, deletePlantilla } from '~/services/plantillaServices'
import addPlantilla from '../../components/configuracion/addPlantilla.vue';
export default {
  name: 'Empleados',
  components:{
    addPlantilla
  },
  data() {
    return {
      headers: [
        { text: '#', value: 'index', sortable: false },
        { text: 'Titulo', value: 'title', sortable: false },
        { text: 'Categoria', value: 'category', sortable: false },
        { text: 'Tipo', value: 'type', sortable: false },
        { text: 'Descripcion', value: 'description', sortable: false },
        { text: 'Nivel', value: 'level', sortable: false },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ],
      plantillas: [],
      search: '',
      dialog: false,
      dialogComponent: false,
      selectedPlantilla: null,
      searchQuery: '',
    }
  },
  computed: {
    filteredHworks() {
      return this.plantillas.filter(doc => {
        const searchMatch = !this.searchQuery || doc.name.toString().includes(this.searchQuery);
        return searchMatch;
      });
    },
    plantillasList() {
      return [...new Set(this.plantillas.map(t => t.plantillaType))]
    },
  },
  async beforeMount() {
    await this.fetchPlantillas()
  },
  methods: {
    async fetchPlantillas() {
      try {
        this.plantillas = await getPlantillas()
      } catch (error) {
        console.error('Error al obtener Registros.', error)
      }
    },
    editPlantilla(plantilla) {
      this.selectedPlantilla = { ...plantilla }
      this.dialogComponent = true
    },
    async deletePlantilla(id) {
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
          await deletePlantilla(id)
          this.fetchPlantillas()
          Swal.fire("Eliminado", "El registro ha sido eliminado.", "success");
        } catch (error) {
          console.error("Error al eliminar registro:", error);
          Swal.fire("Error", "No se pudo eliminar el registro.", "error");
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
