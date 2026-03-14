'use client';

import {ReactNode} from 'react';
import {GoogleReCaptchaProvider} from 'react-google-recaptcha-v3';

export default function RecaptchaProvider({children}: {children: ReactNode}) {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    const disabled = process.env.NEXT_PUBLIC_DISABLE_RECAPTCHA === 'true';

    if (disabled || !siteKey) {
        return <>{children}</>;
    }

    return (
        <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
            {children}
        </GoogleReCaptchaProvider>
    );
}
