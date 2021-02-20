const defaultTheme = require( 'tailwindcss/defaultTheme' );
const plugin = require( 'tailwindcss/plugin' );
const colors = require('tailwindcss/colors');

// const variants = [
//     'responsive',
//     // 'dark',
//     // 'motion-safe',
//     // 'motion-reduce',
//     // 'first',
//     // 'last',
//     // 'odd',
//     // 'even',
//     'visited',
//     'checked',
//     // 'group-hover',
//     // 'group-focus',
//     // 'focus-within',
//     'hover',
//     'focus',
//     // 'focus-visible',
//     'active',
//     'disabled',
//
//     // '+checked',
//     // '+blank',
//     // '+empty',
//     '+focus',
// ];

module.exports = {
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
        standardFontWeights: true,
    },
    purge: [
        './public/**/*.html',
        './src/**/*.vue',
    ],
    theme: {
        extend: {},
        fontFamily: {
            sans: [ 'Rosario', 'Inter', ...defaultTheme.fontFamily.sans ],
            monospace: [ 'JetBrains Mono' ],
            handwriting: [ 'Dancing Script' ],
        },
        colors: {transparent: 'transparent',
            current: 'currentColor',
            gray: colors.warmGray,
            indigo: colors.indigo,
            yellow: colors.amber,
            black: colors.black,
            white: colors.white,
            red: colors.red,
        },
    },
    plugins: [
        plugin( ( { addVariant, e } ) =>
            addVariant( '+focus', ( { modifySelectors, separator } ) =>
                modifySelectors( ( { className } ) =>
                    `:focus + .${ e( `+focus${ separator }${ className }` ) }` ),
            ),
        ),
    ],
};
