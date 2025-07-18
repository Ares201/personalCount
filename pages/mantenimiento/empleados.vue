<template>
  <v-card height="100%" tile>
    <v-card-title>
      <v-row dense>
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <span class="text-h6">
            <v-icon color="primaryColor" class="mr-3">mdi-account</v-icon>
            EMPLEADOS
          </span>
          <v-btn color="primaryColor" small fab dark @click="dialogComponent= true">
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="searchQuery"
            color="secondaryColor"
            label="Buscar Empleado"
            append-icon="mdi-magnify"
            class="mt-2"
            clearable
            outlined
            dense
            hide-details
          />
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" class="d-flex justify-end">
          <v-btn icon><v-icon color="green">mdi-file-excel</v-icon></v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="empleados"
        :search="searchQuery"
        item-value="id"
        dense
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.state`]="{ item }">
          <v-chip
            :color="returnEstado(item).color"
            :text-color="returnEstado(item).text"
            class="ma-1"
            >{{ item.state }}</v-chip>
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <v-icon small color="secondaryColor" @click="editEmployee(item)">mdi-pencil</v-icon>
          <v-icon small color="dangerColor" @click="deleteEmployee(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card-text>
    <!-- Componente addEmployee -->
    <add-employee
      :dialog = "dialogComponent"
      @closedialog="closedialog"
      @saveEmployee="fetchEmployees"
      :employee="selectedEmployee"
    />
  </v-card>
</template>

<script>
import {  getEmployees, deleteEmployee } from '~/services/employeeServices'
import addEmployee from '../../components/configuracion/addEmployee.vue';
export default {
  name: 'Empleados',
  components:{
    addEmployee
  },
  data() {
    return {
      headers: [
        { text: '#', value: 'index', sortable: false },
        { text: 'Nombre Completo', value: 'name', sortable: false },
        { text: 'Telf. Coorporativo', value: 'phoneCorporate', sortable: false },
        { text: 'Puesto de Trabajo', value: 'workstation', sortable: false },
        { text: 'Estado', value: 'state', sortable: false },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ],
      empleados: [],
      search: '',
      dialog: false,
      dialogComponent: false,
      selectedEmployee: null,
      searchQuery: '',
    }
  },
  computed: {
    filteredHworks() {
      return this.empleados.filter(doc => {
        const searchMatch = !this.searchQuery || doc.name.toString().includes(this.searchQuery);
        return searchMatch;
      });
    }
  },
  async beforeMount() {
    await this.fetchEmployees()
  },
  methods: {
    async fetchEmployees() {
      try {
        this.empleados = await getEmployees()
      } catch (error) {
        console.error('Error al obtener Registros.', error)
      }
    },
    editEmployee(employee) {
      this.selectedEmployee = { ...employee }
      this.dialogComponent = true
    },
    async deleteEmployee(employeeId) {
      if (confirm('¿Estás seguro de eliminar este empleado?')) {
        try {
          await deleteEmployee(employeeId)
          await this.fetchEmployees()
        } catch (error) {
          console.error('Error al eliminar empleado:', error)
        }
      }
    },
    returnEstado(item) {
      let color = "default";
      let text = "default";

      if (item.state === "activo") {
        color = "#C8E6C9";
        text = "#2E7D32";
      } else if (item.state === "inactivo") {
        color = "#FFF9C4";
        text = "#F9A825";
      } else if (item.state === "Retirado") {
        color = "#E1BEE7";
        text = "#6A1B9A";
      } else if (item.state === "bloqueado") {
        color = "#FFCDD2";
        text = "#C62828";        }
      return { color, text };
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
