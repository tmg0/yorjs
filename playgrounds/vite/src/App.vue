<script lang="ts" setup>
import { useModule } from '@yorjs/core'
import { userModule } from './modules/user/user.module'

const { signInForm, signIn } = useModule(userModule)
</script>

<template>
  <div>
    <input v-model="signInForm.username">
    <input v-model="signInForm.password">
    <br>

    <button @click="signIn()">
      sign in
    </button>
  </div>
</template>
