<template>
  <section class="flex flex-col align-middle justify-items-center">
    <article class="flex-grow"></article>
    <article>
      <slot/>
      <figure class="text-center">
        <div class="flex flex-row relative text-red-700 font-bold">
          <div class="flex-grow relative grid grid-rows-2">
            <!--            <div class="text-right bottom-1/2 absolute w-full invisible md:visible">-->
            <div class="text-right bottom-1/2 absolute w-full">
              <!--              <a href="" class="inline-block px-2 py-1 mx-1">Background</a>-->
              <!--              <a href="" class="inline-block px-2 py-1 mx-1">Portfolio</a>-->
              <a href="https://docs.google.com/document/d/1lAMVLKyeDm2YrZdJl92gcg103YaSXBgjVDIeXBh3M1c"
                 target="_blank" class="inline-block px-2 py-1 mx-1">Resume</a>
            </div>
          </div>
          <picture>
            <img class="h-48 w-48 inline-block object-cover rounded-full shadow-lg"
                 src="@/assets/img/profile/profile-picture.jpg">
          </picture>
          <div class="flex-grow relative grid grid-rows-2">
            <!--            <div class="text-left bottom-1/2 absolute w-full invisible md:visible">-->
            <div class="text-left bottom-1/2 absolute w-full">
              <!--              <a href="" class="inline-block px-2 py-1 mx-1">Path</a>-->
              <!--              <a href="" class="inline-block px-2 py-1 mx-1">PodCast</a>-->
              <a href="/contact" class="inline-block px-2 py-1 mx-1"
                 @click.prevent="contactDialog.open()">Contact</a>
            </div>
          </div>
          <div class="h-1/2 w-full absolute bg-gray-800 bottom-0" style="z-index: -1"/>
        </div>
        <figcaption class="py-2 bg-gray-800 text-gray-300">
          <h1 class="text-4xl font-handwriting">
            <strong>Salathiel Genese</strong>
          </h1>
          <p class="text-lg">DevOps, Fullstack</p>
          <small>TypeScript, JavaScript, Java, Rust</small>
        </figcaption>
      </figure>
    </article>
    <div class="flex-grow border-none bg-gray-800"/>


    <DialogBox title="Contact" ref="contactDialog">
      <section class="my-2 md:my-4">
        <ul class="text-sm font-monospace">
          <li class="my-3">
            <strong>GSM & Signal</strong>
            <br>
            <a href="tel:+23054929511">+230 5492 9511</a>
          </li>
          <li class="my-3">
            <strong>Twitter</strong>
            <br>
            <a href="https://twitter.com/SalathielGenese" target="_blank">
              https://twitter.com/SalathielGenese
            </a>
          </li>
          <li class="my-3">
            <strong>LinkedIn</strong>
            <br>
            <a href="https://www.linkedin.com/in/salathielgenese" target="_blank">
              https://www.linkedin.com/in/salathielgenese
            </a>
          </li>
        </ul>
      </section>
    </DialogBox>
  </section>
</template>

<script lang="ts">
import DialogBox from '@/app/shared/components/dialog-box.vue';
import { useMeta } from '@/app/shared/plugins/meta';
import { defineComponent, ref } from 'vue';

export default defineComponent( {
  name: 'Home',
  components: { DialogBox },
  setup() {
    useMeta()( { title: 'DevOps, Fullstack - TypeScript, JavaScript, Java, Rust' } );
    return {
      contactDialog: ref(),
    };
  },
} );
</script>
