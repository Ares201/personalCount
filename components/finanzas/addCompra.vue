<template>
  <v-dialog v-model="dialog" max-width="550px">
    <v-card>
      <v-card-title>
        <span class="text-h6">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Fecha"
                v-model="compra.fecha"
                outlined
                required
                type="date"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="compra.concepto"
                label="Concepto"
                outlined
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="compra.descripcion"
                label="Descripción"
                outlined
                required
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="7" md="8">
              <v-btn color="success darken-1" icon outlined @click="dialogDetail = true">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
            <v-spacer/>
            <v-col cols="5" md="4">
              <v-chip
                class="ma-2"
                color="orange"
                text-color="white"
              >
                {{ compra.monto ? 'Total: S/. ' + compra.monto : 'Total: S/. 0' }}
              </v-chip>
            </v-col>
          </v-row>
          <v-row class="m-0">
            <v-col cols="12">
              <div
                class="pb-4"
                v-for="(detail, index) in detailBox" :key="index"
                v-touch:swipe.right="() => onSwipeRight(index)"
                v-touch:swipe.left="() => onSwipeLeft(index)"
              >
                <v-row dense>
                  <v-col cols="1" class="mr-2" align-center>
                    <v-chip color="primary" small>{{ index + 1 }}</v-chip>
                  </v-col>
                  <v-col cols="7">
                    <v-text-field
                      v-model="detail.detalle"
                      label="Detalle"
                      dense
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      v-model="detail.monto"
                      label="Monto"
                      type="number"
                      dense
                      hide-details
                    >
                      <template v-slot:prepend-inner>
                        <span class="ml-1">S/</span>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
          <!-- Modal para detalles -->
          <v-dialog v-model="dialogDetail" max-width="400px">
            <v-card>
              <v-card-title>
                <span class="text-h6">Añadir Detalle</span>
              </v-card-title>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Detalle"
                    v-model="newDetail.detalle"
                    outlined
                    required
                  />
                  <v-text-field
                    label="Monto"
                    v-model="newDetail.monto"
                    outlined
                    required
                    type="number"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="addDetail">
                  Agregar
                </v-btn>
                <v-btn color="grey" text @click="dialogDetail = false">
                  Cancelar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="saveCompra">Guardar</v-btn>
        <v-btn color="grey" text @click="close">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { createBox, updateBox } from '../../services/boxServices';

export default {
name: 'addCompra',
props: {
  dialog: { type: Boolean, default: false },
  boxs: { type: Object, default: () => ({
    id: null,
    fecha: '',
    concepto: '',
    monto: 0 ,
    descripcion: '',
    detailBox: []
  }) }
},
data() {
  return {
    compra: { ...this.boxs },
    detailBox: [],
    newDetail: { detalle: '', monto: 0, estado: false }, // Para capturar datos del modal
    dialogDetail: false // Control para abrir/cerrar el modal de detalle
  }
},
watch: {
  boxs: {
    handler(newCompra) {
      this.compra = {
        ...newCompra,
        monto: parseFloat(newCompra.monto) // Convertir monto de compra a número
      };
      this.detailBox = (newCompra.detailBox || []).map(detail => ({
        ...detail,
        monto: parseFloat(detail.monto) // Convertir monto de cada detalle a número
      }));
    },
    deep: true
  }
},
computed: {
  formTitle() {
    return this.compra.id === null ? 'Nuevo Compra' : 'Editar Compra'
  }
},
methods: {
  onSwipeRight(index) {
    // Mostrar el botón de eliminar para este detalle
    this.$set(this.detailBox[index], 'showDelete', true);
  },
  onSwipeLeft(index) {
    // Ocultar el botón de eliminar al hacer swipe a la izquierda
    this.$set(this.detailBox[index], 'showDelete', false);
  },
  changeStatus(detail){
    console.log(detail)
    detail.estado = !detail.estado
  },
  removeDetail(index) {
    this.detailBox.splice(index, 1);
  },
  addDetail() {
    if (this.newDetail.detalle && this.newDetail.monto) {
      this.detailBox.push({
        ...this.newDetail,
        monto: parseFloat(this.newDetail.monto) // Convertir a número
      });
      this.newDetail = { id: null, detalle: '', monto: 0, estado: false }; // Reiniciar campos
      this.dialogDetail = false; // Cerrar el modal
    } else {
      alert('Por favor, complete todos los campos.');
    }
  },
  async saveCompra() {
    try {
      this.compra.monto = parseFloat(this.compra.monto); // Convertir monto de compra a número
      this.detailBox = this.detailBox.map(detail => ({
        ...detail,
        monto: parseFloat(detail.monto) // Convertir monto de cada detalle a número
      }));
      if (this.compra.id) {
        await updateBox(this.compra.id, {
          fecha: this.compra.fecha,
          monto: this.detailBox.reduce((monto, detail) => monto + detail.monto, 0),
          descripcion: this.compra.descripcion,
          concepto: this.compra.concepto,
          detailBox: this.detailBox
        });
      } else {
        // Crear nueva compra
        await createBox({
          tipo: 'Compra',
          fecha: this.compra.fecha,
          monto: this.detailBox.reduce((monto, detail) => monto + detail.monto, 0),
          descripcion: this.compra.descripcion,
          concepto: this.compra.concepto,
          detailBox: this.detailBox
        });
      }
      this.$emit('saveCompra');
      this.close();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  },
  close () {
    this.$emit('closedialog')
    this.compra = {
      id: null,
      fecha: '',
      monto: 0,
      descripcion: '',
      concepto: '',
      detailBox: []
    }
  },
}
}
</script>