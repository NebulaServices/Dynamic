import * as esbuild from 'esbuild';

const build = async () => {
    console.time("esbuild");

    const worker = await esbuild.context({
        entryPoints: ['lib/worker/index.ts'],
        bundle: true,
        outfile: 'static/dynamic/dynamic.worker.js',
        format: 'iife',
        minify: true,
        platform: 'browser',
        sourcemap: true,
        target: ['es2020'],
        plugins: [],
        metafile: true,
    })
    
    worker.watch();

    const handler = await esbuild.context({
        entryPoints: ['lib/handler/index.ts'],
        bundle: true,
        outfile: 'static/dynamic/dynamic.handler.js',
        format: 'iife',
        minify: true,
        platform: 'browser',
        sourcemap: true,
        target: ['es2020'],
        plugins: [],
        metafile: true,
    });

    handler.watch();

    const client = await esbuild.context({
        entryPoints: ['lib/client/index.ts'],
        bundle: true,
        outfile: 'static/dynamic/dynamic.client.js',
        format: 'iife',
        minify: true,
        platform: 'browser',
        sourcemap: true,
        target: ['es2020'],
        plugins: [],
        metafile: true,
    });

    client.watch();

    const html = await esbuild.context({
        entryPoints: ['lib/html/index.ts'],
        bundle: true,
        outfile: 'static/dynamic/dynamic.html.js',
        format: 'iife',
        minify: true,
        platform: 'browser',
        sourcemap: true,
        target: ['es2020'],
        plugins: [],
        metafile: true,
    });

    html.watch();

    console.log(await esbuild.analyzeMetafile((await worker.rebuild()).metafile));

    console.timeEnd("esbuild");

    await new Promise(resolve => null);
}

await build();