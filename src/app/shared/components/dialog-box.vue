<template>
  <teleport to="html > body > main">
    <section class="flex top-0 left-0 flex-col w-screen h-screen absolute items-center overflow-y-scroll"
             style="background-color: rgba(0, 0, 0, .9)" @click="onBackdropClick" v-if="opened">
      <hr class="flex-grow opacity-0"/>
      <article class="px-4 py-2 z-10 m-6 md:m-10 bg-white rounded-sm inline-block" ref="articleRef">
        <slot name="header">
          <header>
            <h2 class="py-1 text-2xl">{{ title }}</h2>
            <hr>
          </header>
        </slot>
        <slot/>
      </article>
      <hr class="flex-grow opacity-0"/>
    </section>
  </teleport>
</template>

<script lang="ts">
import {defineComponent, ref, watch} from "vue";

export default defineComponent({
  name: 'DialogBox',
  props: {
    title: String,
    onOpen: Function,
    onClose: Function,
  },
  setup(props) {
    const opened = ref(false);
    const articleRef = ref<HTMLElement>();

    watch(opened, opened => opened ? props.onOpen?.() : props.onClose?.());

    return {
      onBackdropClick(event: Event) {
        if (!articleRef.value?.contains(event.target as any)) {
          opened.value = false;
        }
      },
      open() {
        opened.value = true;
      },
      articleRef,
      opened,
    };
  },
})
</script>