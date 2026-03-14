'use client';

import {isValidPhoneNumber} from 'libphonenumber-js';
import {ReactNode, useCallback, useMemo, useRef, useState} from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import PhoneInput from 'react-phone-number-input';

import 'react-phone-number-input/style.css';

interface FormData {
    [key: string]: string | undefined;
}

const isDev = process.env.NODE_ENV === 'development';

export default function ContactForm() {
    const defaultData = useMemo(
        () => ({
            from_name: '',
            from_email: '',
            message: '',
        }),
        [],
    );

    const [data, setData] = useState<FormData>(defaultData);
    const [phone, setPhone] = useState<string | undefined>();
    const [phoneError, setPhoneError] = useState<string | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const valueRef = useRef<string | null>(isDev ? 'dev-bypass' : null);
    const [alertMessage, setAlertMessage] = useState<ReactNode>(null);
    const [sending, setSending] = useState(false);

    const onChange = useCallback(
        <T extends HTMLInputElement | HTMLTextAreaElement>(event: React.ChangeEvent<T>): void => {
            const {name, value} = event.target;
            const fieldData: Partial<FormData> = {[name]: value};
            setData({...data, ...fieldData});
        },
        [data],
    );

    const onPhoneChange = useCallback((value: string | undefined) => {
        setPhone(value);
        if (phoneError) setPhoneError(null);
    }, [phoneError]);

    function validateCaptcha(value: string | null) {
        valueRef.current = value;
    }

    const handleSendMessage = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            const hasPhone = !!(phone && phone.replace(/\D/g, '').length > 4);
            if (hasPhone && !isValidPhoneNumber(phone!)) {
                setPhoneError('Please enter a valid phone number');
                return;
            }

            if (!isDev && !valueRef.current) {
                setAlertMessage(<div
                    className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
                    <strong className="font-bold">Hold on! </strong>
                    <span className="block sm:inline">Please verify that you&apos;re not a robot using the reCAPTCHA below.</span>
                </div>);
                return;
            }

            setSending(true);
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        from_name: data.from_name,
                        from_email: data.from_email,
                        from_phone: hasPhone ? phone : '',
                        message: data.message,
                        user_agent: navigator.userAgent,
                        'g-recaptcha-response': valueRef.current,
                    }),
                });

                const result = await response.json();

                if (response.ok) {
                    setAlertMessage(<div
                        className="border-b border-t border-blue-500 bg-blue-100 px-4 py-3 text-blue-700"
                        role="alert">
                        <p className="font-bold">Your message has been sent.</p>
                        <p className="text-sm">Thank you, I will get back to you ASAP!</p>
                    </div>);
                } else {
                    setAlertMessage(<div
                        className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
                        role="alert">
                        <strong className="font-bold">Something went wrong. </strong>
                        <span className="block sm:inline">{result.error || 'Please try contacting me by email.'}</span>
                    </div>);
                }
            } catch {
                setAlertMessage(<div
                    className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
                    role="alert">
                    <strong className="font-bold">Network error. </strong>
                    <span className="block sm:inline">Please try again or contact me by email.</span>
                </div>);
            } finally {
                setSending(false);
            }
        },
        [data, phone],
    );

    const inputClasses =
        'bg-neutral-700 border-0 focus:border-0 focus:outline-hidden focus:ring-1 focus:ring-orange-600 rounded-md placeholder:text-neutral-400 placeholder:text-sm text-neutral-200 text-sm';

    return (
        <form className="grid min-h-[320px] grid-cols-1 gap-y-4" method="POST" onSubmit={handleSendMessage}>
            <input className={inputClasses} name="from_name" onChange={onChange} placeholder="Name" required type="text" />
            <input
                autoComplete="email"
                className={inputClasses}
                name="from_email"
                onChange={onChange}
                placeholder="Email"
                required
                type="email"
            />
            <div>
                <label className="mb-1 block text-xs text-neutral-400">WhatsApp number (optional)</label>
                <PhoneInput
                    className="phone-input-dark"
                    defaultCountry="IL"
                    international
                    onChange={onPhoneChange}
                    placeholder="Enter phone number"
                    value={phone}
                />
                {phoneError && (
                    <p className="mt-1 text-xs text-red-400">{phoneError}</p>
                )}
            </div>
            <textarea
                className={inputClasses}
                maxLength={250}
                name="message"
                onChange={onChange}
                placeholder="Message"
                required
                rows={6}
            />

            {alertMessage && <div>{alertMessage}</div>}

            <div className="flex flex-col justify-around gap-6 sm:flex-row">
                {!isDev && (
                    <div><ReCAPTCHA
                        onChange={validateCaptcha}
                        ref={recaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''}
                        size="normal"
                        theme="dark"
                    /></div>
                )}
                {isDev && (
                    <div className="flex items-center rounded-md bg-yellow-900/30 px-3 py-2 text-xs text-yellow-400">
                        reCAPTCHA disabled in dev mode
                    </div>
                )}

                <div>
                    <button
                        aria-label="Submit contact form"
                        className="w-max rounded-full border-2 border-orange-600 bg-stone-900 px-4 py-2 text-sm font-medium text-white shadow-md outline-hidden hover:bg-stone-800 focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 focus:ring-offset-stone-800 disabled:opacity-50"
                        disabled={sending}
                        type="submit">
                        {sending ? 'Sending...' : 'Send Message'}
                    </button>
                </div>
            </div>
        </form>
    );
}
