<template>
    <article>
        <form @submit.prevent="submit" class="max-w-md">
            <Label description="Email" :field="form.email" class="py-2">
                <template v-slot:default="{ field }">
                    <input type="text" v-model="field.$model"
                           :class="{'border-red-600': !!field.$errors?.length}"
                           class="text-gray-600 border px-1 rounded-sm focus:outline-none"/>
                </template>
            </Label>
            <Label description="Lastname" :field="form.lastname">
                <template v-slot:default="{ field }">
                    <input type="text" v-model="field.$model"
                           :class="{'border-red-600': !!field.$errors?.length}"
                           class="text-gray-600 border px-1 rounded-sm focus:outline-none"/>
                </template>
            </Label>
            <Label description="Content" :field="form.content">
                <template v-slot:default="{ field }">
                        <textarea v-model="field.$model"
                                  :class="{'border-red-600': !!field.$errors?.length}"
                                  class="text-gray-600 border px-1 rounded-sm focus:outline-none"/>
                </template>
            </Label>
            <footer class="mt-4">
                <button type="submit" :disabled="!form.email.$model || form.$invalid || meta.isSubmitting"
                        :class="{ 'bg-red-700 text-red-200': !form.$invalid, 'bg-gray-300 text-gray-400': form.$invalid }"
                        class="inline-block rounded-sm uppercase shadow-lg text-sm px-3 py-1">
                    Send
                </button>
            </footer>
        </form>
    </article>
    <!--    Contact / Available / Hire-->
</template>

<script>
import { useContactForm } from '@/app/shared/composition/contact/use-contact.form';
import { reactive } from 'vue';
import Label from '@/app/shared/components/form/label';

export default {
    name: 'contact',
    components: { Label },
    setup() {
        const { reset, form, submit: doSubmit } = useContactForm();
        let meta = reactive( { isSubmitting: false } );

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
