import {NextRequest, NextResponse} from 'next/server';

function parseUserAgent(ua: string) {
    let browser = 'Unknown';
    let version = 'Unknown';
    let os = 'Unknown';
    let platform = 'Unknown';

    // OS
    if (ua.includes('Windows NT 10')) { os = 'Windows 10'; platform = 'Windows'; }
    else if (ua.includes('Windows NT 11') || (ua.includes('Windows NT 10') && ua.includes('Windows 11'))) { os = 'Windows 11'; platform = 'Windows'; }
    else if (ua.includes('Windows')) { os = 'Windows'; platform = 'Windows'; }
    else if (ua.includes('Mac OS X')) {
        const match = ua.match(/Mac OS X (\d+[._]\d+[._]?\d*)/);
        os = match ? `macOS ${match[1].replace(/_/g, '.')}` : 'macOS';
        platform = 'macOS';
    }
    else if (ua.includes('iPhone')) { os = 'iOS'; platform = 'iPhone'; }
    else if (ua.includes('iPad')) { os = 'iPadOS'; platform = 'iPad'; }
    else if (ua.includes('Android')) {
        const match = ua.match(/Android (\d+\.?\d*)/);
        os = match ? `Android ${match[1]}` : 'Android';
        platform = 'Android';
    }
    else if (ua.includes('Linux')) { os = 'Linux'; platform = 'Linux'; }

    // Browser
    if (ua.includes('Edg/')) {
        const match = ua.match(/Edg\/([\d.]+)/);
        browser = 'Edge'; version = match?.[1] ?? '';
    } else if (ua.includes('OPR/') || ua.includes('Opera')) {
        const match = ua.match(/OPR\/([\d.]+)/);
        browser = 'Opera'; version = match?.[1] ?? '';
    } else if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
        const match = ua.match(/Chrome\/([\d.]+)/);
        browser = 'Chrome'; version = match?.[1] ?? '';
    } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
        const match = ua.match(/Version\/([\d.]+)/);
        browser = 'Safari'; version = match?.[1] ?? '';
    } else if (ua.includes('Firefox/')) {
        const match = ua.match(/Firefox\/([\d.]+)/);
        browser = 'Firefox'; version = match?.[1] ?? '';
    }

    return {browser, version, os, platform};
}

const noIndex = {'X-Robots-Tag': 'noindex, nofollow, noarchive'};

export async function POST(request: NextRequest) {
    const body = await request.json();
    const {from_name, from_email, from_phone, message, user_agent, 'g-recaptcha-response': recaptchaToken} = body;

    if (!from_name || !from_email || !message) {
        return NextResponse.json({error: 'Missing required fields'}, {status: 400});
    }

    // Server-side input length validation
    if (from_name.length > 100 || from_email.length > 200 || message.length > 500) {
        return NextResponse.json({error: 'Input too long'}, {status: 400});
    }

    if (from_phone && from_phone.length > 20) {
        return NextResponse.json({error: 'Invalid phone number'}, {status: 400});
    }

    // Verify reCAPTCHA server-side
    if (process.env.NEXT_PUBLIC_DISABLE_RECAPTCHA !== 'true') {
        if (!recaptchaToken) {
            return NextResponse.json({error: 'reCAPTCHA verification required'}, {status: 400});
        }
        const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({secret: process.env.RECAPTCHA_SECRET_KEY || '', response: recaptchaToken}).toString(),
        });
        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
            return NextResponse.json({error: 'reCAPTCHA verification failed'}, {status: 400});
        }
    }

    // Parse user agent from client or fallback to request header
    const ua = user_agent || request.headers.get('user-agent') || '';
    const {browser, version, os, platform} = parseUserAgent(ua);

    // Get referrer
    const referrer = request.headers.get('referer') || 'direct';

    try {
        // Send notification to site owner
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                service_id: process.env.EMAILJS_SERVICE_ID,
                template_id: process.env.EMAILJS_TEMPLATE_ID,
                user_id: process.env.EMAILJS_PUBLIC_KEY,
                accessToken: process.env.EMAILJS_PRIVATE_KEY,
                template_params: {
                    title: `New inquiry from ${from_name}`,
                    to_email: process.env.EMAILJS_TO_EMAIL,
                    from_name,
                    from_email,
                    from_phone: from_phone || 'Not provided',
                    message,
                    user_browser: browser,
                    user_version: version,
                    user_os: os,
                    user_platform: platform,
                    user_referrer: referrer,
                    'g-recaptcha-response': recaptchaToken,
                },
            }),
        });

        if (!response.ok) {
            console.error('EmailJS error:', await response.text());
            return NextResponse.json({error: 'Failed to send message'}, {status: 500});
        }

        return NextResponse.json({text: 'OK'}, {headers: noIndex});
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json({error: 'Failed to send message'}, {status: 500});
    }
}
