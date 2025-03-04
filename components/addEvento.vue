<template>
  <v-dialog v-model="dialog" max-width="800px">
    <v-card>
      <v-card-title class="justify-center mb-2">
        <span class="text-h6">{{ formTitle }}</span>
      </v-card-title>
      <v-divider class="mb-4"></v-divider>
      <v-card>
        <!-- <v-card-title class="headline">CENTRO CONTROL INFORMA</v-card-title> -->
        <v-card-text>
          <v-form ref="form">
            <v-container>
              <v-row dense>
                <v-col cols="6">
                  <v-label>Evento:</v-label>
                  <v-text-field
                    v-model="event.evento"
                    outlined
                    dense
                    hide-details
                  />
                </v-col>
                <v-col cols="6">
                  <v-label>Nivel:</v-label>
                  <v-text-field
                    v-model="event.nivel"
                    outlined
                    dense
                    hide-details
                  />
                </v-col>
                <v-col cols="6">
                  <v-label>Placa:</v-label>
                  <v-text-field
                    v-model="event.placa"
                    outlined
                    dense
                    hide-details
                  />
                </v-col>
                <v-col cols="6">
                  <v-label>Fecha:</v-label>
                  <v-text-field
                    v-model="event.fecha"
                    outlined type="date"
                    dense
                    hide-details
                  />
                </v-col>
                <v-col cols="6">
                  <v-label>Hora:</v-label>
                  <v-text-field
                    v-model="event.hora"
                    outlined type="time"
                    dense
                    hide-details
                  />
                </v-col>
                <v-col cols="6">
                  <v-label>Estado:</v-label>
                  <v-select :items="['Cargado', 'Vacío']" v-model="event.estado" outlined dense hide-details clearable />
                </v-col>
                <v-col cols="6">
                  <v-label>Cámaras:</v-label>
                  <v-select :items="['Si Cuenta', 'No Cuenta']" v-model="event.camaras" outlined dense hide-details clearable />
                </v-col>
                <v-col cols="6">
                  <v-label>Operador:</v-label>
                  <v-text-field v-model="event.operador" outlined dense hide-details />
                </v-col>
                <v-col cols="6">
                  <v-label>Contrato:</v-label>
                  <v-select
                    :items="['CONDESTABLE', 'CEMENTO CL', 'CERRO LINDO', 'ATACOCHA', 'CATALINA HUANCA']"
                    v-model="event.contrato"
                    outlined
                    dense
                    hide-details
                    clearable
                  />
                </v-col>
                <v-col cols="6">
                  <v-label>Ubicación:</v-label>
                  <v-text-field v-model="event.ubicacion" outlined dense hide-details />
                </v-col>
                <v-col cols="12">
                  <v-label>Detalles:</v-label>
                  <v-textarea v-model="event.detalle" outlined dense hide-details />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="saveEvent" :loading="loading">
          {{ this.event.id === null ? 'Guardar' : 'Editar' }}
        </v-btn>
        <v-btn color="grey" text @click="close">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { createEvent, updateEvent } from '../services/eventServices';

export default {
  name: 'addEvent',
  props: {
    dialog: { type: Boolean, default: false },
    events: {
      type: Object,
      default: () => ({
        id: null,
        id: null,
        evento: '',
        nivel: '',
        placa: '',
        fecha: '',
        hora: '',
        estado: '',
        camaras: '',
        operador: '',
        contrato: '',
        ubicacion: '',
        detalle: ''
      })
    }
  },
  data() {
    return {
      loading: false,
      event: { ...this.events }
    }
  },
  watch: {
    dialog: {
      handler(newVal) {
        if (newVal) {
          this.event = this.events.id ? { ...this.events } :
          {
            id: null,
            evento: '',
            nivel: '',
            placa: '',
            fecha: '',
            hora: '',
            estado: '',
            camaras: '',
            operador: '',
            contrato: '',
            ubicacion: '',
            detalle: ''
          }
        }
      },
      immediate: true
    },
    events: {
      handler(newEvent) {
        this.event = { ...newEvent }
      },
      deep: true
    }
  },
  computed: {
    formTitle() {
      return this.event.id === null ? 'Nuevo Evento' : 'Editar Evento'
    }
  },
  methods: {
    async saveEvent() {
      try {
        this.loading= true
        if (this.event.id) {
          await updateEvent(this.event.id, {
            evento: this.event.evento,
            nivel: this.event.nivel,
            placa: this.event.placa,
            fecha: this.event.fecha,
            hora: this.event.hora,
            estado: this.event.estado,
            camaras: this.event.camaras,
            operador: this.event.operador,
            contrato: this.event.contrato,
            ubicacion: this.event.ubicacion,
            detalle: this.event.detalle
          })
        } else {
          await createEvent({
            evento: this.event.evento,
            nivel: this.event.nivel,
            placa: this.event.placa,
            fecha: this.event.fecha,
            hora: this.event.hora,
            estado: this.event.estado,
            camaras: this.event.camaras,
            operador: this.event.operador,
            contrato: this.event.contrato,
            ubicacion: this.event.ubicacion,
            detalle: this.event.detalle
          })
        }
        this.$emit('saveEvent')
        this.close()
        this.loading= false
      } catch (error) {
        console.error('Error al guardar evento:', error)
      }
    },
    close() {
      this.$emit('closedialog')
      this.event = {
        id: null,
        evento: '',
        nivel: '',
        placa: '',
        fecha: '',
        hora: '',
        estado: '',
        camaras: '',
        operador: '',
        contrato: '',
        ubicacion: '',
        detalle: ''
      }
    },
  }
}
</script>