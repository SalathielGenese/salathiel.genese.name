import Attributes = MetaPlugin.Attributes;
import MetaOptions = MetaPlugin.MetaOptions;
import { SSR_ENV } from '@/app/env';
import { App, getCurrentInstance, inject, InjectionKey, isRef, Ref } from 'vue';
import { useRouter } from 'vue-router';

const isObject = ( value: unknown ): value is object => 'object' === typeof value;
const perAppAttributes = new WeakMap<App, [ MetaOptions, Attributes ]>();
const key: InjectionKey<( attributes: Attributes ) => void> = Symbol();
const unwrap = ( value: any ) => isRef( value ) ? value.value : value;

export const MetaPlugin = ( app: App, options: MetaOptions ) => {
    app.provide( key, SSR_ENV
        ? ( attributes = {} ) => perAppAttributes.set( app, [ options, attributes ] )
        : ( () => {
            const titleElement = document.querySelector( 'head > title' )
                || document.createElement( 'title' );

            document.contains( titleElement ) || document.head.appendChild( titleElement );

            return ( attributes: Attributes ) => {
                titleElement.innerHTML = useMeta.computeTitle( options, attributes );
                return attributes;
            };
        } )() );
};

export const useMeta = (): typeof key extends InjectionKey<infer T> ? T : never =>
    getCurrentInstance()?.type === useRouter().currentRoute.value.matched[ 0 ]?.components.default
        ? inject( key )! : Function.prototype as any;

useMeta.computeTitle = ( { titleTemplate }: MetaOptions, { title }: Attributes ): string => {
    const template = isRef( titleTemplate )
        ? titleTemplate.value
        : !isObject( titleTemplate )
            ? unwrap( titleTemplate ) ?? ''
            : ( v => isRef( v ) ? v.value : v ?? '' )( title ? titleTemplate.filled : titleTemplate.empty );

    if ( !title && !template ) {
        throw new Error( '[meta] Missing both title and fallback template.' );
    }

    return template.replace( '{}', unwrap( title ) ?? '' );
};

if ( SSR_ENV ) {
    useMeta.get = ( app: App ) => perAppAttributes.get( app );
}

export namespace MetaPlugin {
    type Dynamic<T> = T | Ref<T>;
    type MetaAttributes = Record<string, MetaAttribute>;
    type MetaAttribute = Dynamic<string | [ string, ...string[] ]>;

    export interface MetaOptions {
        metas?: MetaAttributes;
        titleTemplate?: Dynamic<string> | {
            filled?: Dynamic<string>;
            empty?: Dynamic<string>;
        };
    }

    export interface Attributes {
        metas?: MetaAttributes;
        title?: Dynamic<string>;
    }
}
