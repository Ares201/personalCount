<template>
  <v-card height="100%" tile>
    <v-card-title>
      <v-row dense>
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <span class="text-h6">
            <v-icon color="primaryColor" class="mr-3">mdi-truck</v-icon>
            VEHICULOS
          </span>
          <v-btn color="primaryColor" small fab dark @click="dialogComponent= true">
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="searchQueryGeneral"
            color="secondaryColor"
            label="Buscar..."
            append-icon="mdi-magnify"
            class="mt-2"
            clearable
            outlined
            dense
            hide-details
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-autocomplete
            v-model="selectTypeVehicle"
            :items="vehiclesList"
            label="Filtrar Tipo de Unidad"
            color="secondaryColor"
            class="mt-2"
            outlined
            dense
            hide-details
            clearable
          >
          </v-autocomplete>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="filteredVehicles"
        item-value="id"
        dense
        mobile-breakpoint="0"
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.hasCamera`]="{ item }">
          <span>{{ item.hasCamera ? 'Equipado' : 'No Equipado' }}</span>
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <v-icon small color="secondaryColor" @click="editVehicle(item)">mdi-pencil</v-icon>
          <v-icon small color="dangerColor" @click="deleteVehicle(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card-text>
    <!-- Componente addVehicle -->
    <add-vehicle
      :dialog = "dialogComponent"
      @closedialog="closedialog"
      @saveVehicle="fetchVehicles"
      :vehicle="selectedVehicle"
    />
  </v-card>
</template>

<script>
import {  getVehicles, deleteVehicle } from '~/services/vehicleServices'
import addVehicle from '../../components/configuracion/addVehicle.vue';
export default {
  name: 'Empleados',
  components:{
    addVehicle
  },
  data() {
    return {
      headers: [
        { text: '#', value: 'index', sortable: false },
        { text: 'Tipo de Unidad', value: 'vehicleType', sortable: false },
        { text: 'Placa', value: 'plate', sortable: false },
        { text: 'Marca', value: 'brand', sortable: false },
        { text: 'Tiene Cámara', value: 'hasCamera', sortable: false },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ],
      vehiculos: [],
      search: '',
      dialog: false,
      selectedVehicle: {},
      dialogComponent: false,
      selectTypeVehicle: null,
      searchQueryGeneral: null,
    }
  },
  computed: {
    filteredVehicles() {
      return this.vehiculos.filter(doc => {
        const vehicleMatch = !this.selectTypeVehicle || doc.vehicleType === this.selectTypeVehicle;
        // Búsqueda general (si hay searchQueryGeneral)
        const generalSearchMatch = !this.searchQueryGeneral ||
        Object.values(doc).some(value => {
          if (value === null || value === undefined) return false;
          return value.toString().toLowerCase().includes(this.searchQueryGeneral.toLowerCase());
        });
        return vehicleMatch && generalSearchMatch;
      });
    },
    vehiclesList() {
      return [...new Set(this.vehiculos.map(t => t.vehicleType))]
    }
  },
  async beforeMount() {
    await this.fetchVehicles()
  },
  methods: {
    async fetchVehicles() {
      try {
        this.vehiculos = await getVehicles()
      } catch (error) {
        console.error('Error al obtener Registros.', error)
      }
    },
    editVehicle(vehicle) {
      this.selectedVehicle = { ...vehicle }
      this.dialogComponent = true
    },
    async deleteVehicle(vehicleId) {
      if (confirm('¿Estás seguro de eliminar este empleado?')) {
        try {
          await deleteVehicle(vehicleId)
          await this.fetchVehicles()
        } catch (error) {
          console.error('Error al eliminar empleado:', error)
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
