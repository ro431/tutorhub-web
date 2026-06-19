import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');
    console.log(`Outgoing Request: ${req.method} ${req.url}`);

    if (token && typeof token === 'string' && token.length > 20) {
        console.log("AuthInterceptor: Valid token found, adding header");
        const cloned = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(cloned);
    }

    console.log("AuthInterceptor: NO valid token found");
    return next(req);
};
