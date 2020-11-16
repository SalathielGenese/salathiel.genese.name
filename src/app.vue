<template>
    <router-view/>
    <Footer class="px-4 py-8"/>
</template>

<script>
import Footer from '@/app/shared/components/footer';
export default {
    name: 'App',
    components: { Footer },
};
</script>
