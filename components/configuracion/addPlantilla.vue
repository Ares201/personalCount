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
                label="Titulo"
                v-model="currentPlantilla.title"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Categoria"
                v-model="currentPlantilla.category"
                outlined
                dense
                hide-details
              />
            </v-col>
             <v-col cols="12" md="12">
              <v-select
                label="Nivel"
                v-model="currentPlantilla.level"
                :items="['Bajo', 'Medio', 'Alto']"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="12">
              <v-textarea
                v-model="currentPlantilla.description"
                label="Descripcion "
                rows="3"
                outlined
                dense
                clearable
                auto-grow
                color="secondaryColor"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primaryColor" text @click="savePlantilla">
          {{ this.currentPlantilla.id === null ? 'Guardar' : 'Editar' }}
        </v-btn>
      <v-btn color="neutralColor" text @click="close">Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>
<script>
import Swal from 'sweetalert2'
import { createPlantilla,  updatePlantilla } from '~/services/plantillaServices'
export default {
name: 'addPlantilla',
props: {
  dialog: { type: Boolean, default: false },
  plantilla: {
    type: Object, default: () => ({
      id: null,
      title: '',
      category: '',
      level: '',
      description: ''
    })
  }  // Plantilla a editar
},
data() {
  return {
    currentPlantilla: { ...this.plantilla },
    operations: []
  }
},
watch: {
  plantilla: {
    handler(newPlantilla) {
      this.currentPlantilla = { ...newPlantilla };
    },
    deep: true
  }
},
computed: {
  formTitle () {
    return this.currentPlantilla.id === null ? 'Nuevo Plantilla' : 'Editar Plantilla'
  },
},
beforeMount () {
},
methods: {
  async savePlantilla() {
    try {
      const docData = {
        title: this.currentPlantilla.title,
        category: this.currentPlantilla.category,
        level: this.currentPlantilla.level,
        description: this.currentPlantilla.description,
      }
      if (this.currentPlantilla.id) {
        await updatePlantilla(this.currentPlantilla.id, docData)
      } else {
        await createPlantilla(docData)
      }
      this.$emit('savePlantilla')
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
    this.currentPlantilla = {
      id: null,
      title: '',
      category: '',
      level: '',
      description: ''
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