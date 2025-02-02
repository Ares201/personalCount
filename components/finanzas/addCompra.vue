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
              <v-btn color="success darken-1" class="ml-4" @click="dialogDetail = true">
                <v-icon>mdi-plus</v-icon>
                <span class="d-none d-md-inline">Añadir Detalle</span>
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
          <v-row>
            <v-col cols="12">
              <v-list>
                <v-list-item v-for="(detail, index) in detailBox" :key="index">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ detail.detalle }} - S/.{{ detail.monto }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ detail.estado ? 'Cancelado' : 'Pendiente' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <div style="display: flex; align-items: center;">
                      <v-checkbox v-model="detail.estado" />
                      <v-icon
                        @click="removeDetail(index)"
                        color="red"
                        class="ml-2"
                        title="Eliminar"
                      >
                        mdi-delete
                      </v-icon>
                    </div>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
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
  removeDetail(index) {
    this.detailBox.splice(index, 1);
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