<template>
  <v-card>
    <v-card-title>Gestión de Permisos</v-card-title>
    <v-card-text>
      <v-select
        v-if="usuarios.length"
        v-model="selectedUserId"
        :items="usuarios"
        item-value="id"
        item-text="name"
        label="Selecciona un usuario"
        @change="fetchPermissions"
        clearable
      />
      <v-container v-if="selectedUser">
        <v-row>
          <v-col v-for="(route, index) in availableRoutes" :key="index" cols="12" sm="6" md="4">
            <v-card outlined>
              <v-card-title class="d-flex align-center">
                <v-checkbox
                  :input-value="permissions.includes(route)"
                  @change="togglePermission(route)"
                  class="mr-2"
                />
                <span>{{ route }}</span>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="updatePermissions(selectedUser)">
        Guardar Permisos
      </v-btn>
    </v-card-actions>
  </v-card>
</template>


<script>
import { getUsers } from '~/services/userServices';
import { fetchUserPermissions, updateUserPermissions } from '~/services/permissionsService';

export default {
  data() {
    return {
      usuarios: [],
      selectedUserId: null,
      selectedUser: null,
      permissions: [],
      availableRoutes: [
        // Mantenimiento
        "/mantenimiento/usuarios",
        "/mantenimiento/empleados",
        "/mantenimiento/vehiculo",
        "/saturno/operacionesMina",
        // Finanzas
        "/finanzas/dashboard",
        "/finanzas/ingresos",
        "/finanzas/salidas",
        "/finanzas/compras",
        // Saturno
        "/saturno/dashboard",
        "/saturno/flashreport",
        "/saturno/eventos",
        "/saturno/horasLaborales",
      ]
    };
  },
  async beforeMount() {
    await this.fetchUsers();
  },
  methods: {
    togglePermission(route) {
      if (this.permissions.includes(route)) {
        this.permissions = this.permissions.filter(p => p !== route);
      } else {
        this.permissions.push(route);
      }
    },
    async fetchUsers() {
      try {
        const users = await getUsers();
        if (!users || !Array.isArray(users)) {
          throw new Error("No se encontraron usuarios");
        }
        this.usuarios = users.map(user => ({
          ...user, // <-- Esto copia todos los campos del usuario
          name: user.name || "Usuario sin nombre"
        }));
        console.log("Usuarios cargados:", this.usuarios);
      } catch (error) {
        console.error("Error al obtener usuarios:", error.message || error);
      }
    },
    async fetchPermissions() {
      this.selectedUser = this.usuarios.find(u => u.id === this.selectedUserId);
      if (!this.selectedUser?.id) return;
      try {
        const permisos = await fetchUserPermissions(this.selectedUser.id);
        this.permissions = Array.isArray(permisos) ? permisos : [];
      } catch (error) {
        console.error("Error al obtener permisos:", error.message || error);
      }
    },
    async updatePermissions(selectedUser) {
      if (selectedUser.role === "Administrador") {
        alert("Usted Tiene el Role de ADMINISTRADOR");
      } else {
        try {
          await updateUserPermissions(selectedUser.id, {
            permissions: this.permissions
          });
          alert("Permisos actualizados correctamente");
        } catch (error) {
          console.error("Error al actualizar permisos:", error);
          alert("Hubo un error al actualizar los permisos");
        }
      }
    },
  }
};
</script>
