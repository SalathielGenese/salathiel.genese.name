import { router } from '@/app/routed';
import { renderToString } from '@vue/server-renderer';
import Express from 'express';
import { promises as fs } from 'fs';
import app from './main';

const maybeWrap = fs.readFile( 'index.html' )
    .then( buffer => buffer.toString() )
    .then( content => ( main: string ) =>
        content.replace( /<main(\s.*)>.*<\/main>/, `<main $1>${ main }</main>` ) );
const { PORT = 8080 } = process.env;
const server = Express();

server.use( '/favicon.ico', Express.static( 'favicon.ico' ) );
server.use( '/fonts', Express.static( 'fonts' ) );
server.use( '/css', Express.static( 'css' ) );
server.use( '/img', Express.static( 'img' ) );
server.use( '/js', Express.static( 'js' ) );
server.get( '*', async ( request, response ) => {
    await router.push( request.url );

    const wrap = await maybeWrap;
    const content = await renderToString( app );

    response.end( wrap( content ) );
} );
server.listen( PORT, () => console.log( `Server started at 0.0.0.0:${ PORT }` ) );
