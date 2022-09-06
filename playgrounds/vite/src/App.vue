<script lang="ts" setup>
import { useModule } from '@yor/core'
import { UserModule } from './modules/user/user.module'

const { user, usernameSignInForm, token, signIn, fetchUser } = useModule(UserModule)
</script>

<template>
  <div>
    <input v-model="usernameSignInForm.username" />
    <input v-model="usernameSignInForm.password" />
    <br />

    <button @click="signIn()">sign in</button>
    <button @click="fetchUser()">fetch user info</button>

    <div>token: {{ token }}</div>
    <div>sign in form: {{ usernameSignInForm }}</div>
    <div>user info: {{ user }}</div>
  </div>
</template>
