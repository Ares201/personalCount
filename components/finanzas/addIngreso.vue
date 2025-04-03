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
              <v-menu
                v-model="menuFecha"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="ingreso.fecha"
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
                <v-date-picker color="secondaryColor" v-model="ingreso.fecha" @input="menuFecha = false"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Monto"
                prefix="S/."
                class="custom-autocomplete"
                v-model="ingreso.monto"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="12">
              <v-autocomplete
                v-model="ingreso.categoria"
                color="secondaryColor"
                :items="['Disponible', 'Ahorro', 'Devolucion', 'Otro']"
                item-text="name"
                label="Categoria"
                class="custom-autocomplete"
                clearable
                outlined
                dense
                hide-no-data
                hide-selected
                hide-details
              />
            </v-col>
            <v-col cols="12" md="12">
              <v-textarea
                label="Descripcion (¿Qué pasó?)"
                class="custom-autocomplete"
                rows="3"
                v-model="ingreso.descripcion"
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
        <v-btn color="primaryColor" text @click="saveIngreso">
          {{ this.ingreso.id === null ? 'Guardar' : 'Editar' }}
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
name: 'addIngreso',
props: {
  dialog: { type: Boolean, default: false },
  boxs: { type: Object, default: () => ({ id: null, fecha: '', monto: 0 , categoria: '', descripcion: ''}) }
},
data() {
  return {
    ingreso: { ...this.boxs },
    menuFecha: false,
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
      const docData = {
        tipo: 'Ingreso',
        fecha: this.ingreso.fecha,
        monto: this.ingreso.monto,
        categoria: this.ingreso.categoria,
        descripcion: this.ingreso.descripcion,
      }

      if (this.ingreso.id) {
        await updateBox(this.ingreso.id, docData)
        Swal.fire({
          icon: 'success',
          title: 'Registro editado',
          text: 'El ingreso ha sido creado exitosamente.',
          showConfirmButton: false,
          timer: 1500
        })
      } else {
        await createBox(docData)
        console.log(docData)
        Swal.fire({
          icon: 'success',
          title: 'Registro creado',
          text: 'El ingreso ha sido editado exitosamente.',
          showConfirmButton: false,
          timer: 1500
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
<style scoped>
.custom-autocomplete ::v-deep(.v-input__control) {
  border-radius: 10px;
}
</style>