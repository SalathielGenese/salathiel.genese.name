module.exports = {
    devServer: {
        disableHostCheck: true,
    },
    ...process.env.SSR ? {
        chainWebpack: ( wc ) => {
            const { WebpackManifestPlugin } = require( 'webpack-manifest-plugin' );
            const nodeExternals = require( 'webpack-node-externals' );

            for (const plugin of [ 'friendly-errors', 'progress', 'prefetch', 'preload', 'define', 'hmr' ]) {
                wc.plugins.delete( plugin );
            }

            for (const rule of [ 'tsx', 'vue', 'ts', 'js' ]) {
                wc.module.rule( rule ).uses.delete( 'cache-loader' );
            }

            wc.plugin( 'manifest' ).use( new WebpackManifestPlugin( { fileName: 'ssr-manifest.json' } ) );
            wc.externals( nodeExternals( { allowlist: /\.(css|vue)$/ } ) );
            wc.optimization.splitChunks( false ).minimize( false );
            wc.entryPoints.delete('app');

            wc.entry( 'ssr' ).clear().add( './src/ssr.ts' );
            wc.output.libraryTarget( 'commonjs2' );
            wc.target( 'node' );
        },
    } : {},
};
