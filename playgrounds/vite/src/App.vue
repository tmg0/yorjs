<script lang="ts" setup>
import { useModule } from '../../../packages/core'
import { UserModule } from './modules/user/user.module'

const { usernameSignInForm, token, signIn } = useModule(UserModule)
</script>

<template>
  <div>
    <input v-model="usernameSignInForm.username" />
    <input v-model="usernameSignInForm.password" />
    <br />

    <button @click="signIn()">sign in</button>

    <div>token: {{ token }}</div>
    <div>sign in form: {{ usernameSignInForm }}</div>
  </div>
</template>
