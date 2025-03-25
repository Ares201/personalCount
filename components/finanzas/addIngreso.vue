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
          v-model="ingreso.fecha"
          outlined
          type="date"
        ></v-text-field>
        <v-text-field
          label="Monto"
          v-model="ingreso.monto"
          outlined
        ></v-text-field>
        <v-select
          v-model="ingreso.categoria"
          :items="['Saturno', 'Studioxperto', 'Otros']"
          label="Categoria"
          outlined
          clearable
        />
        <v-text-field
          v-model="ingreso.descripcion"
          label="Descripción"
          outlined
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="saveIngreso">Guardar</v-btn>
      <v-btn color="grey" text @click="close">Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>
<script>
import { createBox, updateBox } from '../../services/boxServices';
export default {
name: 'addIngreso',
props: {
  dialog: { type: Boolean, default: false },
  boxs: { type: Object, default: () => ({ id: null, fecha: '', monto: 0 , categoria: '', descripcion: ''}) }
},
data() {
  return {
    ingreso: { ...this.boxs }
  }
},
watch: {
  boxs: {
    handler(newIngreso) {
      this.ingreso = { ...newIngreso, monto: parseFloat(newIngreso.monto) }
    },
    deep: true
  }
},
computed: {
  formTitle() {
    return this.ingreso.id === null ? 'Nuevo Ingreso' : 'Editar Ingreso'
  }
},
methods: {
  async saveIngreso() {
    try {
      this.ingreso.monto = parseFloat(this.ingreso.monto)
      if (this.ingreso.id) {
        await updateBox(this.ingreso.id, {
          fecha: this.ingreso.fecha,
          monto: this.ingreso.monto,
          categoria: this.ingreso.categoria,
          descripcion: this.ingreso.descripcion
        })
      } else {
        await createBox({
          tipo: 'Ingreso',
          fecha: this.ingreso.fecha,
          monto: this.ingreso.monto,
          categoria: this.ingreso.categoria,
          descripcion: this.ingreso.descripcion
        })
      }
      this.$emit('saveIngreso')
      this.close()
    } catch (error) {
      console.error('Error al guardar usuario:', error)
    }
  },
  close () {
    this.$emit('closedialog')
    this.ingreso = {
      id: null,
      fecha: '',
      monto: '',
      caegoria: '',
      descripcion: '',
    }
  },
}
}
</script>