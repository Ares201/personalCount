  <!-- <v-container>
            <v-row dense>
              <v-col cols="12" md="3">
                <v-text-field
                  label="Rango de Horas"
                  v-model="hwork.rangoHoras"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  label="Placa Tracto"
                  v-model="hwork.placaTracto"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  :items="employees"
                  label="Conductor"
                  v-model="hwork.employee"
                  outlined
                  dense
                  clearable
                  item-text="name"
                  item-value="id"
                  return-object
                >
                  <template #append-item>
                    <v-divider />
                    <v-list-item link @click="OpenDialogEmployee()" class="fixed-option">
                        <a>
                          + Empleado
                        </a>
                      </v-list-item>
                    <v-divider />
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  :items="['CONDESTABLE', 'CEMENTO CL', 'ECOSERM CL', 'CERRO LINDO', 'ATACOCHA', 'CATALINA HUANCA', 'EN BASE']"
                  label="Operación"
                  v-model="hwork.operacion"
                  outlined
                  dense
                  clearable
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-text-field
                  label="Hora de Inicio"
                  v-model="hwork.horaInicio"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  label="Tiempo Transcurrido"
                  v-model="hwork.tiempoTranscurrido"
                  outlined
                  type="date"
                  dense
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-text-field
                  label="Estado"
                  v-model="hwork.estado"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-text-field
                  label="Ubicación"
                  v-model="hwork.ubicacion"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-text-field
                  label="Ubicación"
                  v-model="hwork.ubicacion"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-text-field
                  label="Destino"
                  v-model="hwork.destino"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-text-field
                  label="Condicion"
                  v-model="hwork.condicion"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-text-field
                  label="Ruta"
                  v-model="hwork.ruta"
                  outlined
                  dense
                />
              </v-col>
            </v-row>
          </v-container> -->