import { useEffect } from 'react';

import analytics from 'utilities/GoogleAnalytics';

export default function useGoogleAnalytics(screen) {
    useEffect(() => {
        analytics.init();
    }, []);

    useEffect(() => {
        analytics.sendPageview(screen);
    }, [screen]);
}
