<template>
  <v-dialog v-model="dialog" max-width="700px">
  <v-card>
    <v-card-title class="d-flex justify-space-between align-center mb-2">
      <span class="text-h6 mx-auto">{{ formTitle }}</span>
      <v-btn outlined icon color="neutralColor">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider class="mb-4"></v-divider>
    <v-card-text>
      <v-form ref="form">
        <v-container>
          <v-row dense>
            <v-col cols="12" md="12">
              Datos Personales
              <v-divider></v-divider>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Nombre Completo"
                v-model="currentEmployee.name"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="DNI"
                v-model="currentEmployee.dni"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Licencia"
                v-model="currentEmployee.licencia"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Telefono Personal"
                v-model="currentEmployee.phonePersonal"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="12" class="mt-4">
              Datos Seguimiento
              <v-divider></v-divider>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Puesto de Trabajo"
                v-model="currentEmployee.workstation"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Fecha de Ingreso"
                v-model="currentEmployee.dateIncome"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Telefono Corporativo"
                v-model="currentEmployee.phoneCorporate"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="currentEmployee.state"
                :items="statusOptions"
                label="Estado"
                color="primary"
                class="custom-autocomplete"
                outlined
                hide-details
                dense
                item-text="text"
                item-value="value"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primaryColor" text @click="saveEmployee">
          {{ this.currentEmployee.id === null ? 'Guardar' : 'Editar' }}
        </v-btn>
      <v-btn color="neutralColor" text @click="close">Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>
<script>
import Swal from 'sweetalert2'
import { createEmployee,  updateEmployee } from '~/services/employeeServices'
export default {
name: 'addEmployee',
props: {
  dialog: { type: Boolean, default: false },
  employee: {
    type: Object, default: () => ({
      id: null,
      name: '',
      dni: '',
      licencia: '',
      phonePersonal: '',
      workstation: '',
      dateIncome: '',
      phoneCorporate: '',
      state: '',
    })
  }  // Empleado a editar
},
data() {
  return {
    statusOptions:[
      { text: 'Activo', value: 'activo' },
      { text: 'Inactivo', value: 'inactivo' },
      { text: 'Retirado', value: 'retirado' },
      { text: 'Bloqueado', value: 'bloqueado' }
    ],
    currentEmployee: { ...this.employee }  // Inicializamos currentEmployee con el valor del usuario recibido como prop
  }
},
watch: {
  employee: {
    handler(newEmployee) {
      this.currentEmployee = { ...newEmployee };
    },
    deep: true
  }
},
computed: {
  formTitle () {
    return this.currentEmployee.id === null ? 'Nuevo Empleado' : 'Editar Empleado'
  }
},
methods: {
  async saveEmployee() {
    try {
      const data = {
        name: this.currentEmployee.name || '',
        dni: this.currentEmployee.dni || '',
        licencia: this.currentEmployee.licencia || '',
        phonePersonal: this.currentEmployee.phonePersonal || '',
        workstation: this.currentEmployee.workstation || '',
        dateIncome: this.currentEmployee.dateIncome || '',
        phoneCorporate: this.currentEmployee.phoneCorporate || '',
        state: this.currentEmployee.state || 'activo',
      }
      if (this.currentEmployee.id === null) {
        await createEmployee(data)
      } else {
        await updateEmployee(this.currentEmployee.id, data)
      }
      this.$emit('saveEmployee')
      this.close()
    } catch (error) {
       Swal.fire({
        title: 'Error al guardar plantilla',
        html: `<pre>${error.message || error}</pre>`,
        icon: 'error'
      })
    }
  },
  close () {
    this.$emit('closedialog')
    this.currentEmployee = {
      id: null,
      name: '',
      workstation: '',
      area: '',
      workHours: '',
      dni: '',
      phone: '',
    }
  },
}
}
</script>