import { useEffect, useRef } from 'react';

export function useTitle(title: string) {
    const defaultTitle = useRef(document.title);

    useEffect(() => {
        document.title = `${title} | Aurora ERP`;

        return () => {
            document.title = defaultTitle.current;
        };
    }, [title]);
}
