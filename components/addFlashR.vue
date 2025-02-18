<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h6">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  label="N° Flash Report"
                  v-model="document.numero"
                  outlined
                  required
                  dense
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  :items="['CONDESTABLE', 'CEMENTO CL', 'CERRO LINDO', 'ATACOCHA', 'CATALINA HUANCA', 'EN BASE']"
                  label="Operación"
                  v-model="document.operacion"
                  outlined
                  required
                  dense
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Evento"
                  v-model="document.evento"
                  outlined
                  required
                  dense
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                label="Fecha de Envío"
                v-model="document.fechaEnvio"
                outlined
                required
                type="date"
                dense
              />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                label="Fecha Solicitud"
                v-model="document.fechaSolicitud"
                outlined
                required
                type="date"
                dense
              />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Fecha de Respuesta"
                  v-model="document.fechaRepuesta"
                  outlined
                  required
                  type="date"
                  dense
                />
              </v-col>
              <v-col v-if="document.fechaRepuesta" cols="12" md="6">
                <v-select
                  :items="['Giancarlo Cervera', 'Paolo Limaco', 'Jair Macazana', 'Ronal Zevallos', 'Victor Pinto']"
                  label="Operador CC"
                  v-model="document.operador"
                  outlined
                  required
                  dense
                />
              </v-col>
              <v-col v-if="document.fechaRepuesta" cols="12" md="6">
                <v-text-field
                label="Link"
                v-model="document.link"
                outlined
                required
                dense />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  :items="['Pendiente', 'En Proceso', 'Completado', 'No Solicitado']"
                  label="Estado"
                  v-model="document.estado"
                  outlined
                  required
                  dense
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="saveDocument" :loading="loading">Guardar</v-btn>
        <v-btn color="grey" text @click="close">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { createDocument, updateDocument } from '../services/documentServices';

export default {
  name: 'addDocument',
  props: {
    dialog: { type: Boolean, default: false },
    documents: {
      type: Object,
      default: () => ({ id: null, numero: '', operacion: '', evento: '', fechaEnvio: '', fechaRepuesta: '', fechaSolicitud: '', operador: '', link: '', estado: '' })
    }
  },
  data() {
    return {
      loading: false,
      document: { ...this.documents }
    }
  },
  watch: {
    documents: {
      handler(newDocument) {
        this.document = { ...newDocument }
      },
      deep: true
    }
  },
  computed: {
    formTitle() {
      return this.document.id === null ? 'Nuevo Documento' : 'Editar Documento'
    }
  },
  methods: {
    async saveDocument() {
      try {
        this.loading= true
        if (this.document.id) {
          await updateDocument(this.document.id, { ...this.document })
        } else {
          await createDocument({ ...this.document })
        }
        this.$emit('saveDocument')
        this.close()
        this.loading= false
      } catch (error) {
        console.error('Error al guardar documento:', error)
      }
    },
    close() {
      this.$emit('closedialog')
      this.document = { id: null, numero: '', operacion: '', evento: '', fechaEnvio: '', fechaRepuesta: '', fechaSolicitud: '', operador: '', link: '', estado: '' }
    },
  }
}
</script>