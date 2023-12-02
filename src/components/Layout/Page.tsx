import {NextPage} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {memo} from 'react';

import {HomepageMeta} from '../../data/dataDef';

const Page: NextPage<HomepageMeta> = memo(({children, title, description, image}) => {
    const {asPath: pathname} = useRouter();

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta content={description} name="description"/>
                {image && <meta content={image} property="og:image" />}
                <meta name="google-site-verification" content="1-dVg2TEGMtNGcmJ7Mg10WP1NBeH9fOVBhMqqDQNnhY" />
                {/* several domains list the same content, make sure google knows we mean this one. */}
                <link href={"https://github.com/georgekhananaev/resume-website"} key="canonical" rel="canonical"/>

                <link href="/favicon.ico" rel="icon" sizes="any"/>
                <link href="/icon.svg" rel="icon" type="image/svg+xml"/>
                <link href="/apple-touch-icon.png" rel="apple-touch-icon"/>
                <link href="/site.webmanifest" rel="manifest"/>

                {/* Open Graph : https://ogp.me/ */}
                <meta content={title} property="og:title"/>
                <meta content={description} property="og:description"/>
                <meta content={"https://github.com/georgekhananaev/resume-website"} property="og:url"/>
                <meta content={title} name="twitter:title"/>
                <meta content={description} name="twitter:description"/>
            </Head>
            {children}
        </>
    );
});

Page.displayName = 'Page';
export default Page;
