<template>
  <v-card height="100%" tile>
    <v-card-title>
      <span class="text-h6">Gestión de Empleados</span>
      <v-spacer />
      <v-btn color="primary" small fab dark @click="dialogComponent = true"><v-icon dark>mdi-plus</v-icon></v-btn>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="empleados"
        item-value="id"
        dense
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <v-icon small color="blue" @click="editEmployee(item)">mdi-pencil</v-icon>
          <v-icon small color="red" @click="deleteEmployee(item.id)">mdi-delete</v-icon>
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
        { text: 'Nombre', value: 'name', sortable: false },
        { text: 'Puesto de Trabajo', value: 'workstation', sortable: false },
        { text: 'Area', value: 'area', sortable: false },
        { text: 'Horas de Trabajo', value: 'workHours', sortable: false },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ],
      empleados: [],
      search: '',
      dialog: false,
      dialogComponent: false,
      selectedEmployee: null
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
