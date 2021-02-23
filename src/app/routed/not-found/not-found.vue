<template>
  <Home>
    <div class="items-center absolute w-full text-center h-1/3 top-0 flex">
      <div class="w-full">
        <h1 class="font-handwriting text-red-700 font-bold text-2xl mb-4"
            style="text-shadow: 1px 2px 5px rgba(0, 0, 0, .3)">
          Oops ! Page Not Found.
        </h1>
        <p class="text-gray-500">
          Double-check the URL or
          <br/>
          Contact me to report it, please.
        </p>
      </div>
    </div>
  </Home>
</template>

<script lang="ts">
import Home from '@/app/routed/home/home.vue';
import { defineComponent } from 'vue';

export default defineComponent( {
  name: 'NotFound',
  components: { Home },
} );
</script>
