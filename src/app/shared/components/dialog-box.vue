<template>
  <!--  <teleport to="html > body > main">-->
  <section class="flex top-0 left-0 flex-col w-screen min-h-screen absolute items-center"
           style="background-color: rgba(0, 0, 0, .9)"
           @click="onBackdropClick"
           v-if="opened">
    <hr class="flex-grow opacity-0"/>
    <article class="px-4 py-2 z-10 m-6 md:m-10 bg-white rounded-sm inline-block">
      <slot name="header">
        <header>
          <h2 class="py-1 text-2xl">
            {{ title }}
          </h2>
          <hr>
        </header>
      </slot>
      <slot/>
    </article>
    <hr class="flex-grow opacity-0"/>
  </section>
  <!--  </teleport>-->
</template>

<script lang="ts">
export default {
  name: 'DialogBox',
  props: {
    title: String,
  },
  setup(abc) {
    return {
      opened: true,
      onBackdropClick(event: Event) {
        alert('Click');
        console.log(event, abc)
      },
    };
  },
}
</script>