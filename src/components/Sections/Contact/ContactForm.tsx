/* eslint-disable */

import React, {FC, memo, useCallback, useMemo, useRef, useState} from 'react';

import ReCAPTCHA from 'react-google-recaptcha';
import emailjs from '@emailjs/browser';

interface FormData {
    [key: string]: string | undefined;
}


const ContactForm: FC = memo(() => {

    const defaultData = useMemo(
        () => ({
            from_name: '',
            from_email: '',
            message: '',
            captcha: '',
        }),
        [],
    );

    const [data, setData] = useState<FormData>(defaultData);
    const recaptchaRef = React.createRef<ReCAPTCHA>();
    const valueRef = useRef<string | null>(null);
    const [alertMessage, setAlertMessage] = useState(<div></div>);


    const onChange = useCallback(
        <T extends HTMLInputElement | HTMLTextAreaElement>(event: React.ChangeEvent<T>): void => {
            const {name, value} = event.target;

            const fieldData: Partial<FormData> = {[name]: value};

            setData({...data, ...fieldData});
        },
        [data],
    );


    function validateCaptcha(value: any) {
        valueRef.current = value
    }


    const handleSendMessage = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            const recaptchaValue = {'g-recaptcha-response': valueRef.current};

            event.preventDefault();
            if (Object.values(valueRef)[0] != null) {
                const dataRecaptchaValue = Object.assign({}, data, recaptchaValue)
                emailjs.send('service_m2eprwy', 'template_e7dxhd9', dataRecaptchaValue, 'ro3MlTQp1L1xhAW0c')
                    .then(function (response) {
                        //  console.log('SUCCESS!', response.status, response.text);
                        setAlertMessage(<div
                            className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3"
                            role="alert">
                            <p className="font-bold">Server Status: {response.text}, Your message has been sent.</p>
                            <p className="text-sm">Thank you, I will get back to you ASAP!</p>
                        </div>)


                    }, function (error) {
                        setAlertMessage(<div
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                            role="alert">
                            <strong className="font-bold">Holy smokes! </strong>
                            <span
                                className="block sm:inline">Something went wrong: {error}, try contacting me by email.</span>
                        </div>)
                    });
            } else {
                setAlertMessage(<div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Holy smokes! </strong>
                    <span className="block sm:inline">You need to verify that you're not a robot, by using the reCAPTCHA below...</span>
                </div>)
                // console.log('Data to send: ', data);
            }

        },
        [data],
    );

    const inputClasses =
        'bg-neutral-700 border-0 focus:border-0 focus:outline-none focus:ring-1 focus:ring-orange-600 rounded-md placeholder:text-neutral-400 placeholder:text-sm text-neutral-200 text-sm';

    return (
        <form className="grid min-h-[320px] grid-cols-1 gap-y-4" method="POST" onSubmit={handleSendMessage}>
            <input className={inputClasses} name="from_name" placeholder="Name" required type="text"/>
            <input
                autoComplete="email"
                className={inputClasses}
                name="from_email"
                onChange={onChange}
                placeholder="Email"
                required
                type="email"
            />
            <textarea
                className={inputClasses}
                maxLength={250}
                name="message"
                onChange={onChange}
                placeholder="Message"
                required
                rows={6}
            />


            <div>{alertMessage}</div>


            <div className='flex flex-col gap-6 sm:flex-row justify-around'>
                <div className=''><ReCAPTCHA
                    ref={recaptchaRef}
                    theme="dark"
                    size="normal"
                    sitekey="6LdHRzcjAAAAAK_pgj_XOvlmIzLEIbfrWnMaIUed"
                    onChange={validateCaptcha}
                /></div>


                <div className=''>
                    <button
                        aria-label="Submit contact form"
                        className="w-max rounded-full border-2 border-orange-600 bg-stone-900 px-4 py-2 text-sm font-medium text-white shadow-md outline-none hover:bg-stone-800 focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 focus:ring-offset-stone-800"
                        type="submit">
                        Send Message
                    </button>
                </div>

            </div>

        </form>


    );
});

ContactForm.displayName = 'ContactForm';
export default ContactForm;

