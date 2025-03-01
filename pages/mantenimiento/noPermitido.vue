<template>
  <v-container>
    <v-card class="pa-5">
      <v-card-title class="red--text">Acceso Denegado</v-card-title>
      <v-card-text>No tienes permisos para acceder a esta página.</v-card-text>
      <v-btn color="primary" @click="$router.push('/')">Ir al inicio</v-btn>
    </v-card>
  </v-container>
</template>
