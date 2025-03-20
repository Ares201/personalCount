<template>
  <v-dialog v-model="dialog" max-width="500px">
  <v-card>
    <v-card-title>
      <span class="text-h6">{{ formTitle }}</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-text-field
          label="Nombre"
          v-model="currentEmployee.name"
          outlined
          required
        ></v-text-field>
        <v-text-field
          label="Puesto de Trabajo"
          v-model="currentEmployee.workstation"
          outlined
          required
        ></v-text-field>
        <v-text-field
          label="Area"
          v-model="currentEmployee.area"
          outlined
          required
        ></v-text-field>
        <v-text-field
          label="Horas de Trabajo"
          v-model="currentEmployee.workHours"
          outlined
          required
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="saveEmployee">Guardar</v-btn>
      <v-btn color="grey" text @click="close">Cancelar</v-btn>
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
  employee: { type: Object, default: () => ({ id: null, name: '', workstation: '', area: '', workHours: '' }) }  // Empleado a editar
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
        })
      } else {
        await createEmployee({
          name: this.currentEmployee.name,
          workstation: this.currentEmployee.workstation,
          area: this.currentEmployee.area,
          workHours: this.currentEmployee.workHours,
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
    }
  },
}
}
</script>