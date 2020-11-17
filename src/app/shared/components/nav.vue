<template>
    <nav class="flex flex-col md:flex-row w-full fixed px-4"
         :class="`${isMobile && opened ? 'h-full' : 'h-auto'}`">
        <div class="flex flex-row cursor-pointer font-bold">
            <i class="ri-menu-fill pr-1 py-2 md:hidden" @click="opened = !opened"/>
            <router-link tag="a" to="/" class="px-1 md:px-0 py-2">
                <span>Salathiel's</span>
            </router-link>
            <HireMe class="absolute right-0 mr-4 my-1 md:hidden" style="margin-top: .375em"/>
        </div>
        <hr class="opacity-25 md:opacity-0 md:flex-grow"/>
        <div class="flex flex-col md:flex-row overflow-y-hidden"
             :class="`${isMobile ? opened ? 'flex-grow h-auto' : 'h-0' : 'h-auto'}`">
            <router-link tag="a" to="/trail" class="px-1 md:px-2 py-2" active-class="font-bold">
                <i class="ri-palette-fill pr-2 py-2"/>
                <span>Trail</span>
            </router-link>
            <router-link tag="a" to="/career" class="px-1 md:px-2 py-2" active-class="font-bold">
                <i class="ri-focus-3-fill pr-2 py-2"/>
                <span>Career</span>
            </router-link>
            <router-link tag="a" to="/portfolio" class="px-1 md:px-2 py-2" active-class="font-bold">
                <i class="ri-artboard-fill pr-2 py-2"/>
                <span>Portfolio</span>
            </router-link>
            <router-link tag="a" to="/contact" class="px-1 md:px-2 py-2" active-class="font-bold">
                <i class="ri-microscope-fill pr-2 py-2"/>
                <span>Contact</span>
            </router-link>
            <hr class="opacity-0 flex-grow md:flex-grow-0">
            <div class="inline-flex justify-center flex-col my-1">
                <HireMe/>
            </div>
        </div>
    </nav>
</template>

<script>
import * as resolveConfig from 'tailwindcss/resolveConfig';
import * as config from '../../../../tailwind.config';
import HireMe from '@/app/shared/components/hire-me';

const { theme: { screens: { md } } } = resolveConfig( config );
const mdWidth = parseInt( md );

export default {
    name: 'Nav',
    components: { HireMe },
    data() {
        return {
            isMobile: true,
            opened: false,
            cleanups: [],
        };
    },
    watch: {
        $route() {
            this.opened = false;
        },
    },
    created() {
        let resizeListener;

        this.cleanups.push( () => removeEventListener( 'resize', resizeListener ) );
        addEventListener( 'resize', resizeListener = () => {
            const { isMobile: wasMobile } = this;

            this.isMobile = innerWidth < mdWidth;
            this.isMobile && !wasMobile && (this.opened = false);
        } );
        dispatchEvent( new Event( 'resize' ) );
    },
    beforeUnmount() {
        this.cleanups.forEach( cleanup => cleanup() );
    },
};
</script>
