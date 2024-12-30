<template>
  <v-container fill-height class="d-flex align-center justify-center" fluid>
    <v-card max-width="400" class="pa-5 elevation-12">
      <v-card-title class="headline text-center">Iniciar Sesión</v-card-title>
      <v-form v-model="valid" ref="form">
        <v-text-field
          v-model="username"
          label="Usuario"
          :rules="[v => !!v || 'El usuario es requerido']"
          required
          outlined
          dense
        />
        <v-text-field
          v-model="password"
          label="Contraseña"
          type="password"
          :rules="[v => !!v || 'La contraseña es requerida']"
          required
          outlined
          dense
        />
        <v-btn
          :disabled="!valid"
          @click="login"
          color="primary"
          block
          class="mt-4"
        >
          Iniciar Sesión
        </v-btn>
      </v-form>
      <v-divider class="my-4"></v-divider>
      <v-row justify="center">
        <v-col cols="12" class="text-center">
          <v-btn text @click="goToRegister">¿No tienes cuenta? Regístrate</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script>
import { getUsers } from '~/services/userServices' // Asegúrate de importar correctamente

export default {
  name:'Login',
  layout: 'app',
  data() {
    return {
      username: '',
      password: '',
      valid: false
    }
  },
  methods: {
    async login() {
      try {
        const usuarios = await getUsers()
        console.log('Usuarios cargados:', usuarios)
        const user = usuarios.find(
          (u) => u.email === this.username && u.password === this.password
        )
        if (user) {
          console.log('Usuario encontrado:', user)
          localStorage.setItem('user', JSON.stringify(user))
          this.$router.push({ name: 'index' }) // Redirige al dashboard
        } else {
          console.error('Usuario o contraseña incorrectos')
          alert('Usuario o contraseña incorrectos')
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error)
      }
    }
  }
}
</script>
<style scoped>
.v-card {
  background-color: #f5f5f5;
  border-radius: 10px;
}
.v-btn.primary {
  background-color: #3f51b5;
  color: white;
}
.v-btn.text {
  color: #3f51b5;
}
</style>
