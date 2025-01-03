<template>
    <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h6">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            label="Nombre"
            v-model="currentUser.name"
            outlined
            required
          ></v-text-field>
          <v-text-field
            label="Email"
            v-model="currentUser.email"
            type="email"
            outlined
            required
          ></v-text-field>
          <v-text-field
            label="Seguridad"
            v-model="currentUser.password"
            type="email"
            outlined
            required
          ></v-text-field>
          <v-select
            v-model="currentUser.role"
            :items="['Administrador', 'Usuario']"
            label="Rol"
            outlined
            required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="saveUser">Guardar</v-btn>
        <v-btn color="grey" text @click="close">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { createUser,  updateUser } from '~/services/userServices'
export default {
  name: 'addUser',
  props: {
    dialog: { type: Boolean, default: false },
    user: { type: Object, default: () => ({ id: null, name: '', email: '', password: '' , role: ''}) }  // Usuario a editar
  },
  data() {
    return {
      currentUser: { ...this.user }  // Inicializamos currentUser con el valor del usuario recibido como prop
    }
  },
  watch: {
    user: {
      handler(newUser) {
        this.currentUser = { ...newUser };
      },
      deep: true
    }
  },
  computed: {
    formTitle () {
      return this.currentUser.id === null ? 'Nuevo Usuario' : 'Editar Usuario'
    }
  },
  methods: {
    async saveUser() {
      try {
        if (this.currentUser.id) {
          await updateUser(this.currentUser.id, {
            name: this.currentUser.name,
            email: this.currentUser.email,
            password: this.currentUser.password,
            role: this.currentUser.role
          })
        } else {
          await createUser({
            name: this.currentUser.name,
            email: this.currentUser.email,
            password: this.currentUser.password,
            role: this.currentUser.role
          })
        }
        this.$emit('saveUser')
        this.close()
      } catch (error) {
        console.error('Error al guardar usuario:', error)
      }
    },
    close () {
      this.$emit('closedialog')
      this.currentUser = {
        id: null,
        name: '',
        email: '',
        password: '',
        role: ''
      }
    },
  }
}
</script>