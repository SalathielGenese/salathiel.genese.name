<template>
    <article>
        <!--        <aside>-->
        <!--            Contact Card-->
        <!--        </aside>-->
        <formfield>
            <legend>
                <h4 class="text-xl font-bold">
                    Drop Me An Email
                </h4>
            </legend>

            <form @submit.prevent="submit">
                <label class="flex flex-col-reverse relative">
                    <input type="text" v-model="form.email.$model"
                           class="text-gray-600 focus:outline-none"/>
                    <div v-if="form.email.$error"
                         class="pointer-events-none invisible +focus:visible absolute top-full text-xs z-10 flex-col flex">
                        <span style="clip-path: polygon(50% 13.34%, 100% 100%, 0 100%)"
                              class="inline-block bg-red-600 h-2 w-2 origin-center rotate-90 ml-1"/>
                        <span class="border-red-600 bg-red-600 text-red-200 text-xs shadow-md rounded-sm border p-1">
                            {{ form.email.$errors?.[ 0 ]?.$message }}
                        </span>
                    </div>
                    <p class="font-bold text-sm">Email</p>
                </label>
                <label class="flex flex-col-reverse relative">
                    <input type="text" v-model="form.lastname.$model"
                           class="text-gray-600 focus:outline-none"/>
                    <div v-if="form.lastname.$error"
                         class="pointer-events-none invisible +focus:visible absolute top-full text-xs z-10 flex-col flex">
                        <span style="clip-path: polygon(50% 13.34%, 100% 100%, 0 100%)"
                              class="inline-block bg-red-600 h-2 w-2 origin-center rotate-90 ml-1"/>
                        <span class="border-red-600 bg-gray-100 text-red-500 text-xs shadow border p-1">
                            {{ form.lastname.$errors?.[ 0 ]?.$message }}
                        </span>
                    </div>
                    <p class="font-bold text-sm">Lastname</p>
                </label>
                <label class="flex flex-col-reverse relative">
                    <textarea v-model="form.content.$model"
                              class="text-gray-600 focus:outline-none"/>
                    <div v-if="form.content.$error"
                         class="pointer-events-none invisible +focus:visible absolute top-full text-xs z-10 flex-col flex">
                            <span style="clip-path: polygon(50% 13.34%, 100% 100%, 0 100%)"
                                  class="inline-block bg-red-600 h-2 w-2 origin-center rotate-90 ml-1">
                            </span>
                        <span class="border-red-600 bg-gray-100 text-red-500 text-xs shadow border p-1">
                                {{ form.content.$errors?.[ 0 ]?.$message }}
                            </span>
                    </div>
                    <p class="font-bold text-sm">Content</p>
                </label>

                <footer>
                    <button type="submit" :disabled="!form.email.$model || form.$invalid || meta.isSubmitting">
                        Send
                    </button>
                </footer>
            </form>
        </formfield>
    </article>
    <!--    Contact / Available / Hire-->
</template>

<script>
import { useContactForm } from '@/app/shared/composition/contact/use-contact.form';
import { reactive } from 'vue';

export default {
    name: 'contact',
    setup() {
        const { reset, form, submit: doSubmit } = useContactForm();
        let meta = reactive( { isSubmitting: false } );
        form.value.$validate();

        return {
            form,
            meta,
            submit: async () => {
                meta.isSubmitting = true;

                try {
                    await doSubmit();
                    form.value.$reset();
                    reset();
                    // TODO: Toast success
                } catch ( _ ) {
                    console.error( _ );
                    // TODO: Toast failure
                } finally {
                    meta.isSubmitting = false;
                }
            },
        };
    },
};
</script>
