<template>
  <v-dialog v-model="dialog" max-width="650px">
    <v-card>
      <v-card-title class="justify-center mb-2">
        <span class="text-h6">{{ formTitle }}</span>
      </v-card-title>
      <v-divider class="mb-4"></v-divider>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row dense>
              <v-col cols="12" sm="12">
                <v-autocomplete
                  v-model="compra.titulo"
                  color="secondaryColor"
                  :items="titleFiltered"
                  item-text="title"
                  label="Titulo"
                  class="custom-autocomplete"
                  clearable
                  outlined
                  dense
                  hide-no-data
                  hide-selected
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-menu
                  v-model="menuFecha"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="compra.fecha"
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
                  <v-date-picker color="secondaryColor" v-model="compra.fecha" @input="menuFecha = false"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="compra.categoria"
                  color="secondaryColor"
                  :items="plantillas"
                  item-text="category"
                  label="Categoria"
                  class="custom-autocomplete"
                  clearable
                  outlined
                  dense
                  hide-no-data
                  hide-selected
                  hide-details
                >
                 <template #append-item>
                      <v-divider />
                      <v-list-item link @click="OpenDialogPlantilla()" class="fixed-option">
                          <a>
                            + Agregar Categoria
                          </a>
                        </v-list-item>
                      <v-divider />
                    </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="compra.descripcion"
                  label="Descripción"
                  class="custom-autocomplete"
                  outlined
                  dense
                  hide-details
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12" class="d-flex justify-space-between align-center">
                <v-btn color="success darken-1" icon outlined @click="dialogDetail = true">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-chip
                  class="ma-1"
                  color="primaryColor"
                  text-color="white"
                >
                   {{
                      compra.categoria === 'COMPRAS'
                        ? (totalDetail ? 'Total: S/. ' + totalDetail : 'Total: S/. 0')
                        : `${detailBox.length}`
                    }}
                </v-chip>
              </v-col>
            </v-row>
            <v-row class="m-0">
              <v-col cols="12">
                <v-data-table
                  :headers="filteredHeaders"
                  :items="detailBox"
                  item-value="id"
                  dense
                  mobile-breakpoint="0"
                  row
                >
                  <template v-slot:[`item.index`]="{ index }">
                    {{ index + 1 }}.-
                  </template>
                  <template v-slot:[`item.detalle`]="{ item }">
                    {{ item.detalle }}
                  </template>
                  <template v-slot:[`item.monto`]="{ item }">
                    S/.{{ item.monto }}
                  </template>
                  <template v-slot:[`item.estado`]="{ item }">
                    <v-checkbox
                      v-model="item.estado"
                      color="success"
                      dense
                      hide-details
                    ></v-checkbox>
                  </template>
                  <template v-slot:[`item.acciones`]="{ item }">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small color="secondaryColor" @click="editDetail(item)" v-bind="attrs" v-on="on">
                          mdi-pencil
                        </v-icon>
                      </template>
                      <span>Editar</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small color="dangerColor" @click="removeDetail(item.id)" v-bind="attrs" v-on="on" >
                          mdi-delete
                        </v-icon>
                      </template>
                      <span>Eliminar</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
          <!-- Modal para detalles -->
          <v-dialog v-model="dialogDetail" max-width="500px">
            <v-card>
              <v-card-title class="justify-center mb-2">
                <span class="text-h6">{{ editIndex !== null ? 'Editar Detalle' : 'Agregar Detalle' }}</span>
              </v-card-title>
              <v-divider class="mb-4"></v-divider>
              <v-card-text>
                <v-form>
                  <v-container>
                    <v-row dense>
                      <v-col cols="12" md="12">
                        <v-textarea
                          label="Detalle"
                          v-model="newDetail.detalle"
                          class="custom-autocomplete"
                          outlined
                          dense
                          hide-details
                          rows="3"
                        />
                      </v-col>
                      <v-col v-if="compra.categoria === 'COMPRAS'" cols="12" md="12">
                        <v-text-field
                          label="Monto"
                          v-model="newDetail.monto"
                          outlined
                          type="number"
                          class="custom-autocomplete"
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
                <v-btn
                  color="primaryColor"
                  depressed
                  @click="saveDetail(newDetail)"
                  text
                >
                  {{ editIndex !== null ? 'Editar' : 'Agregar' }}
                </v-btn>
                <v-btn color="neutralColor" text @click="closeDialogDetail">
                  Cancelar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
          <v-btn color="primaryColor" text @click="saveCompra">
            {{ this.compra.id === null ? 'Guardar' : 'Editar' }}
          </v-btn>
          <v-btn color="neutralColor" text @click="close">Cancelar</v-btn>
      </v-card-actions>
      <!-- Componente addPlantilla -->
      <add-plantilla
        :dialog = "dialogPlantilla"
        @closedialog="closedialogPlantilla"
        @savePlantilla="savePlantilla"
      />
    </v-card>
  </v-dialog>
</template>

<script>
import { createBox, updateBox } from '../../services/boxServices';
import { getPlantillas } from "../../services/plantillaServices";
import addPlantilla from '../../components/configuracion/addPlantilla.vue';

export default {
name: 'addCompra',
components: {
  addPlantilla
},
props: {
  dialog: { type: Boolean, default: false },
  boxs: { type: Object, default: () => ({
    id: null,
    fecha: '',
    categoria: '',
    monto: 0 ,
    descripcion: '',
    detailBox: []
  }) }
},
data() {
  return {
    plantillas: [],
    detailBox: [],
    headers: [
      { text: '#', value: 'index' },
      { text: 'Detalle', value: 'detalle' },
      { text: 'Monto', value: 'monto' },
      { text: 'Estado', value: 'estado' },
      { text: 'Acciones', value: 'acciones' }
    ],
    compra: { ...this.boxs },
    newDetail: { detalle: '', monto: 0, estado: false }, // Para capturar datos del modal
    dialogDetail: false,
    dialogPlantilla: false,
    menuFecha: false,
    editIndex: null,
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
      }))
      .sort((a, b) => {
        // Primero los pendientes (estado === false) y luego los realizados (estado === true)
        if (a.estado === b.estado) return 0;
        return a.estado ? 1 : -1;
        // a.estado false (pendiente) va antes que true (realizado)
      });
    },
    deep: true
  }
},
computed: {
  formTitle() {
    return this.compra.id === null ? 'Nuevo Tarea' : 'Editar Tarea'
  },
   filteredHeaders() {
    const baseHeaders = [
      { text: '#', value: 'index' },
      { text: 'Detalle', value: 'detalle' },
    ];
    if (this.compra.categoria === 'COMPRAS') {
      baseHeaders.push({ text: 'Monto', value: 'monto' });
    }
    baseHeaders.push(
      { text: 'Estado', value: 'estado' },
      { text: 'Acciones', value: 'acciones', sortable: false }
    );

    return baseHeaders;
  },
   titleFiltered() {
    if (!this.compra.categoria) return []
    return this.plantillas.filter(item => item.category === this.compra.categoria)
  },
  totalDetail() {
    return this.detailBox.reduce((sum, detail)=>{
      return sum + (parseFloat(detail.monto || 0 ))
    }, 0)
  }
},
beforeMount() {
  this.getPlantillas()
},
methods: {
  toggleActions(detail) {
    // Si la propiedad no existe, la inicializamos; si existe, la alternamos
    if (typeof detail.showActions === 'undefined') {
      this.$set(detail, 'showActions', true);
    } else {
      detail.showActions = !detail.showActions;
    }
  },
  removeDetail(id) {
    this.detailBox = this.detailBox.filter(detail => detail.id !== id);
  },
  editDetail(detail) {
    console.log(detail)
    this.editIndex = this.detailBox.indexOf(detail);
    this.newDetail = { ...detail };
    this.dialogDetail = true;
  },
  saveDetail(newDetail) {
    console.log(newDetail)
    if (this.newDetail !== null) {
      if (this.editIndex !== null) {
        this.detailBox.splice(this.editIndex, 1, newDetail);
      } else {
        this.detailBox.push(newDetail);
      }
      this.closeDialogDetail();
    }
  },
  async saveCompra() {
    try {
      this.compra.monto = parseFloat(this.compra.monto);
      this.detailBox = this.detailBox.map(detail => ({
        ...detail,
        id: detail.id || '_' + Math.random().toString(36).substr(2, 9),
        monto: parseFloat(detail.monto)
      }));
      const payload = {
        tipo: 'Compra',
        titulo: this.compra.titulo,
        fecha: this.compra.fecha,
        categoria: this.compra.categoria,
        descripcion: this.compra.descripcion,
        monto: this.detailBox.reduce((monto, detail) => monto + detail.monto, 0),
        detailBox: this.detailBox
      };
      if (this.compra.id) {
        await updateBox(this.compra.id, payload);
      } else {
        await createBox(payload);
      }

      this.$emit('saveCompra');
      this.close();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  },
  async savePlantilla() {
    Swal.fire({
      icon: 'success',
      title: 'Plantilla guardada con éxito',
      showConfirmButton: false,
      timer: 1500
    })
  },
  async getPlantillas() {
    try {
      const plantillas = await getPlantillas()
      this.plantillas = plantillas.filter(item =>
        item.category === 'COMPRAS' ||
        item.category === 'TRABAJO' ||
        item.category === 'TAREAS FINANCIERAS'
      );
      console.log(this.plantillas)
    } catch (error) {
      console.error('Error al obtener plantillas:', error)
    }
  },
  OpenDialogPlantilla(){
    this.dialogPlantilla = true
  },
  closedialogPlantilla() {
    this.dialogPlantilla = false;
    this.getPlantillas()
  },
  closeDialogDetail() {
    this.dialogDetail = false
    this.newDetail = {
      detalle: '',
      monto: 0,
      estado: false
    }
    this.editIndex = null
  },
  close () {
    this.$emit('closedialog')
    this.compra = {
      id: null,
      titulo: '',
      fecha: '',
      monto: 0,
      descripcion: '',
      categoria: '',
      detailBox: []
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