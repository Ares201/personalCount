<template>
  <v-dialog v-model="dialog" max-width="500px">
  <v-card>
    <v-card-title>
      <span class="text-h6">{{ formTitle }}</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-text-field
          label="Fecha"
          v-model="salida.fecha"
          outlined
          required
          type="date"
        ></v-text-field>
        <v-text-field
          label="Monto"
          v-model="salida.monto"
          outlined
          required
        ></v-text-field>
        <v-select
          v-model="salida.descripcion"
          :items="['Abono', 'Ventas', 'Otros']"
          label="Descripción"
          outlined
          required
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="saveSalida">Guardar</v-btn>
      <v-btn color="grey" text @click="close">Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>
<script>
import { createBox, updateBox } from '../../services/boxServices';
export default {
name: 'addSalida',
props: {
  dialog: { type: Boolean, default: false },
  boxs: { type: Object, default: () => ({ id: null, fecha: '', monto: '', descripcion: ''}) }
},
data() {
  return {
    salida: { ...this.boxs }
  }
},
watch: {
  boxs: {
    handler(newSalida) {
      this.salida = { ...newSalida }
    },
    deep: true
  }
},
computed: {
  formTitle() {
    return this.salida.id === null ? 'Nueva Salida' : 'Editar Salida'
  }
},
methods: {
  async saveSalida() {
    try {
      if (this.salida.id) {
        await updateBox(this.salida.id, {
          fecha: this.salida.fecha,
          monto: this.salida.monto,
          descripcion: this.salida.descripcion
        })
      } else {
        await createBox({
          tipo: 'Salida',
          fecha: this.salida.fecha,
          monto: this.salida.monto,
          descripcion: this.salida.descripcion
        })
      }
      this.$emit('saveSalida')
      this.close()
    } catch (error) {
      console.error('Error al guardar usuario:', error)
    }
  },
  close () {
    this.$emit('closedialog')
    this.salida = {
      id: null,
      fecha: '',
      monto: '',
      descripcion: ''
    }
  },
}
}
</script>