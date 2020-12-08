<template>
    <label class="flex flex-col-reverse relative cursor-pointer">
        <slot :field="field"/>
        <div v-if="field.$errors?.length"
             class="pointer-events-none invisible +focus:visible absolute top-full text-xs z-10 flex-col flex">
            <span style="clip-path: polygon(50% 13.34%, 100% 100%, 0 100%)"
                  class="inline-block bg-red-600 h-2 w-2 origin-center rotate-90 ml-1"></span>
            <span class="border-red-600 bg-red-600 text-red-200 text-xs shadow-md rounded-sm border p-1">
                {{ field.$errors?.[ 0 ]?.$message }}
            </span>
        </div>
        <p class="text-xs pb-1">
            <slot name="description" :description="description">
                {{ description }}
            </slot>
        </p>
    </label>
</template>

<script>
export default {
    name: 'Label',
    props: {
        field: {
            type: Object,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
};
</script>
