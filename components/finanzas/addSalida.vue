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
            <v-col>
              <v-menu
                v-model="menuFecha"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="salida.fecha"
                    label="Fecha"
                    append-icon="mdi-calendar"
                    color="secondaryColor"
                    class="custom-autocomplete"
                    v-bind="attrs"
                    v-on="on"
                    readonly
                    clearable
                    outlined
                    dense
                    hide-details
                  />
                </template>
                <v-date-picker color="secondaryColor" v-model="salida.fecha" @input="menuFecha = false"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Monto"
                prefix="S/."
                class="custom-autocomplete"
                v-model="salida.monto"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="12">
              <v-autocomplete
                v-model="salida.categoria"
                color="secondaryColor"
                :items="['Compras', 'Prestamo', 'Otro']"
                item-text="name"
                label="Categoria"
                class="custom-autocomplete"
                clearable
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="12">
              <v-textarea
                label="Descripcion (¿Qué pasó?)"
                class="custom-autocomplete"
                rows="3"
                v-model="salida.descripcion"
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
      <v-btn color="primaryColor" text @click="saveSalida">
          {{ this.salida.id === null ? 'Guardar' : 'Editar' }}
       </v-btn>
        <v-btn color="neutralColor" text @click="close">Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>
<script>
import Swal from "sweetalert2";
import { createBox, updateBox } from '../../services/boxServices';
export default {
name: 'addSalida',
props: {
  dialog: { type: Boolean, default: false },
  boxs: { type: Object, default: () => ({ id: null, fecha: '', monto: 0, descripcion: ''}) }
},
data() {
  return {
    salida: { ...this.boxs },
    menuFecha: false
  }
},
watch: {
  boxs: {
    handler(newSalida) {
      this.salida = { ...newSalida, monto: parseFloat(newSalida.monto) }
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
      this.salida.monto = parseFloat(this.salida.monto)
      const docData = {
        tipo: 'Salida',
        fecha: this.salida.fecha,
        monto: this.salida.monto,
        categoria: this.salida.categoria,
        descripcion: this.salida.descripcion
      }
      if(this.salida.id){
        await updateBox(this.salida.id, docData)
        Swal.fire({
          icon: 'success',
          title: 'Registro editado',
          text: 'El ingreso ha sido creado exitosamente.',
          showConfirmButton: false,
          timer: 1500
        })
      } else {
        await createBox(docData)
        Swal.fire({
          icon: 'success',
          title: 'Registro creado',
          text: 'El ingreso ha sido editado exitosamente.',
          showConfirmButton: false,
          timer: 1500
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
      descripcion: '',
      categoria: ''
    }
  },
}
}
</script>
<style scoped>
.custom-autocomplete ::v-deep(.v-input__control) {
  border-radius: 10px;
}
</style>