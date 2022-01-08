import { NextResponse } from 'next/server';

const Middleware = (req, ev) => {
    const { pathname } = req.nextUrl;
    if (pathname.startsWith('/.well-known/private'))
        return NextResponse.redirect('/');
    return NextResponse.next();
};

export default Middleware;
