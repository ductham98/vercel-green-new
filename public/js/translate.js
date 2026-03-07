(async function autoTranslate() {
    const LANG_MAP = {
        'VN': 'vi', 'JP': 'ja', 'KR': 'ko',
        'CN': 'zh-CN', 'TW': 'zh-TW',
        'FR': 'fr', 'DE': 'de', 'IT': 'it',
        'RU': 'ru', 'UA': 'uk', 'PL': 'pl',
        'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'CL': 'es', 'PE': 'es',
        'PT': 'pt', 'BR': 'pt',
        'ID': 'id', 'TH': 'th', 'MY': 'ms',
        'SA': 'ar', 'AE': 'ar', 'EG': 'ar', 'IQ': 'ar', 'MA': 'ar',
        'TR': 'tr', 'NL': 'nl', 'SE': 'sv', 'NO': 'no', 'DK': 'da',
        'FI': 'fi', 'HU': 'hu', 'RO': 'ro', 'CZ': 'cs', 'SK': 'sk',
        'HR': 'hr', 'BG': 'bg', 'GR': 'el', 'HE': 'he', 'IL': 'he',
        'PH': 'tl', 'IN': 'hi', 'PK': 'ur', 'BD': 'bn',
        'IR': 'fa', 'AF': 'fa',
    };

    function getGoogtransCookie() {
        const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
        return match ? decodeURIComponent(match[1]) : null;
    }

    function setGoogtransCookie(lang) {
        const value = `/en/${lang}`;
        const hostname = location.hostname;
        // Set for current path
        document.cookie = `googtrans=${value}; path=/`;
        // Also set for root domain (needed on some Vercel setups)
        if (hostname && hostname !== 'localhost') {
            document.cookie = `googtrans=${value}; path=/; domain=${hostname}`;
        }
    }

    async function getCountryCode() {
        try {
            const res = await fetch('https://apip.cc/json');
            const data = await res.json();
            return (data.CountryCode || '').toUpperCase();
        } catch (e) {
            try {
                // Fallback API
                const res2 = await fetch('https://ipapi.co/json/');
                const data2 = await res2.json();
                return (data2.country_code || '').toUpperCase();
            } catch (e2) {
                return '';
            }
        }
    }

    // If cookie already set, Google Translate handles it automatically
    const existing = getGoogtransCookie();
    if (existing && existing !== '/en/en' && existing !== '/en/') return;

    const countryCode = await getCountryCode();
    if (!countryCode) return;

    const targetLang = LANG_MAP[countryCode];
    if (!targetLang) return; // Unknown country → keep English

    setGoogtransCookie(targetLang);
    location.reload();
})();
