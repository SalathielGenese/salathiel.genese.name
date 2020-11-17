<template>
    <Nav class="bg-gray-200"/>
    <section class="p-4 pt-10">
        <router-view/>
    </section>
    <Footer class="px-4 py-8"/>
</template>

<script>
import Footer from '@/app/shared/components/footer';
import Nav from '@/app/shared/components/nav';
export default {
    name: 'App',
    components: { Nav, Footer },
};
</script>
