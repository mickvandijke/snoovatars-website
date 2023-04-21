import { useLazyPix } from 'lazy-pix';
import {defineNuxtPlugin} from "#app";

const lazyPix = useLazyPix();

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('lazy-pix', lazyPix);
});
