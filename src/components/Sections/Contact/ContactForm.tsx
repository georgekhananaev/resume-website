'use client';

import {isValidPhoneNumber} from 'libphonenumber-js';
import {ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useGoogleReCaptcha} from 'react-google-recaptcha-v3';
import PhoneInput from 'react-phone-number-input';

import 'react-phone-number-input/style.css';

interface FormData {
    [key: string]: string | undefined;
}

interface Challenge {
    question: string;
    answer: number;
}

const recaptchaDisabled = process.env.NEXT_PUBLIC_DISABLE_RECAPTCHA === 'true';

function generateChallenge(): Challenge {
    const ops = [
        () => {const a = Math.floor(Math.random() * 20) + 1; const b = Math.floor(Math.random() * 20) + 1; return {question: `${a} + ${b}`, answer: a + b};},
        () => {const a = Math.floor(Math.random() * 20) + 5; const b = Math.floor(Math.random() * a); return {question: `${a} - ${b}`, answer: a - b};},
        () => {const a = Math.floor(Math.random() * 10) + 1; const b = Math.floor(Math.random() * 10) + 1; return {question: `${a} x ${b}`, answer: a * b};},
    ];
    return ops[Math.floor(Math.random() * ops.length)]();
}

function ChallengeSVG({text}: {text: string}) {
    // Render text as SVG with slight distortion so bots can't easily OCR it
    const chars = text.split('');
    return (
        <svg className="inline-block align-middle" height="28" viewBox="0 0 200 32" width="120" xmlns="http://www.w3.org/2000/svg">
            <rect fill="transparent" height="32" width="200" />
            {chars.map((char, i) => {
                const x = 16 + i * 22;
                const y = 18 + (i % 2 === 0 ? -2 : 3);
                const rotate = (i % 3 - 1) * 5;
                return (
                    <text
                        fill="#d4d4d4"
                        fontFamily="monospace"
                        fontSize="18"
                        fontWeight="700"
                        key={i}
                        textAnchor="middle"
                        transform={`rotate(${rotate}, ${x}, ${y})`}
                        x={x}
                        y={y}>
                        {char}
                    </text>
                );
            })}
            {/* Noise lines */}
            <line stroke="#525252" strokeWidth="0.5" x1="10" x2="190" y1="12" y2="18" />
            <line stroke="#525252" strokeWidth="0.5" x1="5" x2="195" y1="22" y2="8" />
        </svg>
    );
}

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
    const [alertMessage, setAlertMessage] = useState<ReactNode>(null);
    const [sending, setSending] = useState(false);
    const {executeRecaptcha} = useGoogleReCaptcha();

    // Anti-spam: math challenge (client-only to avoid hydration mismatch)
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [challengeAnswer, setChallengeAnswer] = useState('');
    useEffect(() => { setChallenge(generateChallenge()); }, []);

    // Anti-spam: time trap
    const loadTime = useRef(Date.now());
    useEffect(() => { loadTime.current = Date.now(); }, []);

    // Anti-spam: honeypot
    const [honeypot, setHoneypot] = useState('');

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

    const handleSendMessage = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            // Honeypot check
            if (honeypot) return;

            // Time trap: reject if submitted in under 3 seconds
            if (Date.now() - loadTime.current < 3000) {
                setAlertMessage(<div className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
                    <strong className="font-bold">Too fast! </strong>
                    <span className="block sm:inline">Please take a moment to fill out the form.</span>
                </div>);
                return;
            }

            // Math challenge check
            if (challenge && parseInt(challengeAnswer, 10) !== challenge.answer) {
                setAlertMessage(<div className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
                    <strong className="font-bold">Incorrect answer. </strong>
                    <span className="block sm:inline">Please solve the math question to verify you are human.</span>
                </div>);
                setChallenge(generateChallenge());
                setChallengeAnswer('');
                return;
            }

            const hasPhone = !!(phone && phone.replace(/\D/g, '').length > 4);
            if (hasPhone && !isValidPhoneNumber(phone!)) {
                setPhoneError('Please enter a valid phone number');
                return;
            }

            setSending(true);
            try {
                let recaptchaToken = '';
                if (!recaptchaDisabled && executeRecaptcha) {
                    recaptchaToken = await executeRecaptcha('contact_form');
                }

                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        from_name: data.from_name,
                        from_email: data.from_email,
                        from_phone: hasPhone ? phone : '',
                        message: data.message,
                        user_agent: navigator.userAgent,
                        'g-recaptcha-response': recaptchaToken || 'disabled',
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
        [data, phone, executeRecaptcha, honeypot, challenge, challengeAnswer],
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

            {/* Anti-spam: math challenge rendered as SVG */}
            {challenge && (
                <div>
                    <label className="mb-1 flex items-center gap-2 text-xs text-neutral-400">
                        Solve: <ChallengeSVG text={challenge.question} /> = ?
                    </label>
                    <input
                        className={inputClasses}
                        onChange={e => setChallengeAnswer(e.target.value)}
                        placeholder="Your answer"
                        required
                        type="number"
                        value={challengeAnswer}
                    />
                </div>
            )}

            {/* Anti-spam: honeypot (hidden from humans) */}
            <div aria-hidden="true" style={{position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden'}}>
                <label htmlFor="website">Website</label>
                <input
                    autoComplete="off"
                    id="website"
                    name="website"
                    onChange={e => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    type="text"
                    value={honeypot}
                />
            </div>

            {alertMessage && <div>{alertMessage}</div>}

            <div>
                <button
                    aria-label="Submit contact form"
                    className="w-max rounded-full border-2 border-orange-600 bg-stone-900 px-4 py-2 text-sm font-medium text-white shadow-md outline-hidden hover:bg-stone-800 focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 focus:ring-offset-stone-800 disabled:opacity-50"
                    disabled={sending}
                    type="submit">
                    {sending ? 'Sending...' : 'Send Message'}
                </button>
            </div>
        </form>
    );
}
