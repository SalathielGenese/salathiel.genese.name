<template>
    <div class="flex flex-col">
        <h4 class="font-bold text-xl mb-3 pb-2 border-b">
            {{ title }}
        </h4>
        <slot/>
    </div>
</template>
b
<script>
export default {
    name: 'FooterInsight',
    props: {
        title: {
            type: String,
            required: true,
        },
    },
};
</script>
