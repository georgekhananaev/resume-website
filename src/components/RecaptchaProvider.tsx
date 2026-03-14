'use client';

import {ReactNode, useEffect, useRef, useState} from 'react';
import {GoogleReCaptchaProvider} from 'react-google-recaptcha-v3';

export default function RecaptchaProvider({children}: {children: ReactNode}) {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    const disabled = process.env.NEXT_PUBLIC_DISABLE_RECAPTCHA === 'true';
    const [load, setLoad] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (disabled || !siteKey || !ref.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setLoad(true);
                    observer.disconnect();
                }
            },
            {rootMargin: '200px'},
        );
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [disabled, siteKey]);

    if (disabled || !siteKey) {
        return <>{children}</>;
    }

    return (
        <div ref={ref}>
            {load ? (
                <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
                    {children}
                </GoogleReCaptchaProvider>
            ) : (
                children
            )}
        </div>
    );
}
