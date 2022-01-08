import Head from 'next/head';

/* date */
const date = new Date();
const currentDate = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
].join('.');

export default function Main() {
    return (
        <Head>
            <title>Jotter - Jot down anything</title>

            <meta charset="utf8" />
            <meta property="og:site_name" content="812125.xyz" />
            <meta property="og:title" content="Jotter" />
            <meta property="og:description" content="Jot down anything" />
            <meta property="og:image" content="https://812125.xyz/812125.png" />
            <meta property="og:url" content="https://812125.xyz/" />
            <meta property="theme-color" content="#141414" />
            <meta name="color-scheme" content="dark" />
            <meta name="author" content="812125.xyz" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <link
                rel="icon"
                type="image/png"
                href={'https://812125.xyz/favicon.ico?ver=' + currentDate}
            />

            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
                rel="preconnect"
                href="https://fonts.gstatic.com"
                crossorigin
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Roboto+Mono&family=Roboto:wght@300;400;700&display=swap"
                rel="stylesheet"
            />
        </Head>
    );
}
