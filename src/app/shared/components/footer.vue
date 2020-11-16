<template>
    <footer class="bg-gradient-to-b from-purple-900 to-gray-900 text-gray-300">
        <FooterInsight title="Recipe">
            <p class="text-justify">
                My recipe holds into <a href="https://v3.vuejs.org" target="_blank">
                <i class="ri-vuejs-fill"/>
                <span>Vue.js 3</span>
            </a>, <a href="https://v3.vuejs.org" target="_blank">
                <i class="ri-remixicon-fill"/>
                <span>Remix Icon</span>
            </a>, <a href="https://docker.com" target="_blank">
                <i class="ri-anchor-fill"/>
                <span>Docker</span>
            </a>, <a href="https://git-scm.com" target="_blank">
                <i class="ri-git-pull-request-fill"/>
                <span>Git</span>
            </a>, <a href="https://github.com" target="_blank">
                <i class="ri-github-fill"/>
                <span>GitHub</span>
            </a>, <a href="https://cloud.google.com" target="_blank">
                <i class="ri-cloud-fill"/>
                <span>Google Cloud Build & Google Cloud Run</span>
            </a> and, as Cal Newport puts it, a combination of <a href="https://www.calnewport.com/blog/2011/08/11/the-career-craftsman-manifesto/" target="_blank">
                the craftsman mindset and passion
            </a>: lot of <a href="" target="_blank">
                <i class="ri-heart-pulse-fill"/>
                <span>love</span>
            </a> + <a href="" target="_blank">
                <i class="ri-line-chart-fill"/>
                <span>consistent work</span>
            </a> + much luck.
            </p>
        </FooterInsight>
        <FooterInsight title="Copyrights">
            <ul>
                <li v-for="{url, icon, title, text} in copyrights" :key="url" :title="title">
                    <a :href="url" target="_blank" class="flex flex-row py-1">
                        <i v-if="icon" :class="icon" class="pr-1"/>
                        <span>{{ text }}</span>
                    </a>
                </li>
            </ul>
        </FooterInsight>
        <FooterInsight title="Links">
            <ul>
                <li v-for="{url, icon, text} in links" :key="url">
                    <a :href="url" target="_blank" class="flex flex-row py-1">
                        <i v-if="icon" :class="icon" class="pr-1"/>
                        <span>{{ text }}</span>
                    </a>
                </li>
            </ul>
        </FooterInsight>
    </footer>
</template>

<script>
import FooterInsight from '@/app/shared/components/footer/footer-insight';
export default {
    name: 'Footer',
    components: { FooterInsight },
    data() {
        return {
            links: [
                {
                    url: 'https://www.linkedin.com/in/SalathielGenese',
                    icon: 'ri-linkedin-box-fill',
                    text: 'LinkedIn',
                },
                {
                    url: 'https://www.upwork.com/fl/salathielgenese',
                    icon: 'ri-home-gear-fill',
                    text: 'Upwork',
                },
                {
                    url: 'https://github.com/SalathielGenese',
                    icon: 'ri-github-fill',
                    text: 'GitHub',
                },
                {
                    url: 'https://twitter.com/SalathielGenese',
                    icon: 'ri-twitter-fill',
                    text: 'Twitter',
                },
                {
                    url: 'https://paypal.me/SalathielGenese',
                    icon: 'ri-paypal-fill',
                    text: 'PayPal',
                },
            ],
            copyrights: [
                {
                    text: 'Vue.js',
                    icon: 'ri-vuejs-fill',
                    url: 'https://vuejs.org',
                },
                {
                    text: 'Remix Icon',
                    icon: 'ri-remixicon-fill',
                    url: 'https://remixicon.com',
                },
                {
                    text: 'Google Cloud',
                    icon: 'ri-cloud-fill',
                    url: 'https://cloud.google.com',
                },
            ],
        };
    },
};
</script>

<style lang="sass" scoped>
footer
  display: grid
  grid-gap: 3em
  grid-template-areas: 'recipe' 'social' 'copyright'

  @screen md
    grid-template-columns: 2fr 1fr 1fr
    grid-template-areas: 'recipe social copyright'

  div:nth-child(1)
    grid-area: recipe

  div:nth-child(2)
    grid-area: social

  div:nth-child(3)
    grid-area: copyright
</style>
