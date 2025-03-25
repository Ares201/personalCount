<template>
  <v-dialog v-model="dialog" max-width="500px">
  <v-card>
    <v-card-title class="justify-center mb-2">
      <span class="text-h6">{{ formTitle }}</span>
    </v-card-title>
    <v-divider class="mb-4"></v-divider>
    <v-card-text>
      <v-form ref="form">
        <v-container>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                label="Nombre"
                v-model="currentEmployee.name"
                outlined
                dense
                hide-details
              />
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
                label="Area"
                v-model="currentEmployee.area"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Horas de Trabajo"
                v-model="currentEmployee.workHours"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="12">
              Datos Personales
              <v-divider></v-divider>
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
                label="Telefono"
                v-model="currentEmployee.phone"
                outlined
                dense
                hide-details
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primaryColor" text @click="saveEmployee" :loading="loading">
          {{ this.currentEmployee.id === null ? 'Guardar' : 'Editar' }}
        </v-btn>
      <v-btn color="neutralColor" text @click="close">Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>
<script>
import { createEmployee,  updateEmployee } from '~/services/employeeServices'
export default {
name: 'addEmployee',
props: {
  dialog: { type: Boolean, default: false },
  employee: {
    type: Object, default: () => ({
      id: null,
      name: '',
      workstation: '',
      area: '',
      workHours: '',
      dni:'',
      phone:'',
    })
  }  // Empleado a editar
},
data() {
  return {
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
      if (this.currentEmployee.id) {
        await updateEmployee(this.currentEmployee.id, {
          name: this.currentEmployee.name,
          workstation: this.currentEmployee.workstation,
          area: this.currentEmployee.area,
          workHours: this.currentEmployee.workHours,
          dni: this.currentEmployee.dni,
          phone: this.currentEmployee.phone,
        })
      } else {
        await createEmployee({
          name: this.currentEmployee.name,
          workstation: this.currentEmployee.workstation,
          area: this.currentEmployee.area,
          workHours: this.currentEmployee.workHours,
          dni: this.currentEmployee.dni,
          phone: this.currentEmployee.phone,
        })
      }
      this.$emit('saveEmployee')
      this.close()
    } catch (error) {
      console.error('Error al guardar usuario:', error)
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