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
              <v-select
                :items="['TRACTO', 'CARRETA', 'CAMIONETA', 'BOMBONA']"
                label="Tipo de Vehiculo"
                v-model="currentVehicle.vehicleType"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Placa"
                v-model="currentVehicle.plate"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Marca"
                v-model="currentVehicle.brand"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-switch
                v-model="currentVehicle.hasCamera"
                :label="currentVehicle.hasCamera ? 'Equipado' : 'No Equipado'"
                color="primary"
                class="custom-autocomplete"
                hide-details
                dense
              ></v-switch>
            </v-col>
            <v-col cols="12" md="12">
              Datos de la unidad
              <v-divider></v-divider>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primaryColor" text @click="saveVehicle">
          {{ this.currentVehicle.id === null ? 'Guardar' : 'Editar' }}
        </v-btn>
      <v-btn color="neutralColor" text @click="close">Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>
<script>
import Swal from 'sweetalert2'
import { createVehicle,  updateVehicle } from '~/services/vehicleServices'
export default {
name: 'addVehicle',
props: {
  dialog: { type: Boolean, default: false },
  vehicle: {
    type: Object, default: () => ({
      id: null,
      vehicleType: '',
      plate: '',
      brand: '',
      hasCamera: false,
    })
  }  // Vehiculo a editar
},
data() {
  return {
    currentVehicle: { ...this.vehicle },
  }
},
watch: {
  vehicle: {
    handler(newVehicle) {
      this.currentVehicle = { ...newVehicle };
    },
    deep: true
  }
},
computed: {
  formTitle () {
    return this.currentVehicle.id === null ? 'Nuevo Vehiculo' : 'Editar Vehiculo'
  },
},
methods: {
  async saveVehicle() {
    try {
      const docData = {
        vehicleType: this.currentVehicle.vehicleType,
        plate: this.currentVehicle.plate,
        brand: this.currentVehicle.brand,
        hasCamera: this.currentVehicle.hasCamera,
      }
      if (this.currentVehicle.id) {
        await updateVehicle(this.currentVehicle.id, docData)
      } else {
        await createVehicle(docData)
      }
      this.$emit('saveVehicle')
      this.close()
    } catch (error) {
      Swal.fire({
        title: 'Error al guardar vehículo',
        html: `<pre>${error.message || error}</pre>`,
        icon: 'error'
      })
    }
  },
  close () {
    this.$emit('closedialog')
    this.currentVehicle = {
      id: null,
      vehicleType: '',
      plate: '',
      brand: '',
      hasCamera: false,
    }
  },
}
}
</script>
<style>
.custom-autocomplete ::v-deep(.v-input__control) {
  border-radius: 10px;
}
</style>