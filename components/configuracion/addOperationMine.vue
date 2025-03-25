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
                v-model="OperationMine.name"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Distrito"
                v-model="OperationMine.district"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Deartamento"
                v-model="OperationMine.department"
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
      <v-btn color="primaryColor" text @click="saveOperationMine" :loading="loading">
          {{ this.OperationMine.id === null ? 'Guardar' : 'Editar' }}
        </v-btn>
      <v-btn color="neutralColor" text @click="close">Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>
<script>
import { createOperationMine,  updateOperationMine } from '~/services/operationMineServices'
export default {
name: 'addOperationMine',
props: {
  dialog: { type: Boolean, default: false },
  operationMine: {
    type: Object, default: () => ({
      id: null,
      name: '',
      district: '',
      department: '',
    })
  }  // Empleado a editar
},
data() {
  return {
    OperationMine: { ...this.operationMine }  // Inicializamos OperationMine con el valor del usuario recibido como prop
  }
},
watch: {
  operationMine: {
    handler(newOperationMine) {
      this.OperationMine = { ...newOperationMine };
    },
    deep: true
  }
},
computed: {
  formTitle () {
    return this.OperationMine.id === null ? 'Nuevo Empleado' : 'Editar Empleado'
  }
},
methods: {
  async saveOperationMine() {
    try {
      if (this.OperationMine.id) {
        await updateOperationMine(this.OperationMine.id, {
          name: this.OperationMine.name,
          district: this.OperationMine.district,
          department: this.OperationMine.department,
        })
      } else {
        await createOperationMine({
          name: this.OperationMine.name,
          district: this.OperationMine.district,
          department: this.OperationMine.department,
        })
      }
      this.$emit('saveOperationMine')
      this.close()
    } catch (error) {
      console.error('Error al guardar usuario:', error)
    }
  },
  close () {
    this.$emit('closedialog')
    this.OperationMine = {
      id: null,
      name: '',
      district: '',
      department: '',
    }
  },
}
}
</script>