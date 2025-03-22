import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth'; // JWT verification function
import prisma from '@/lib/prisma'; // Prisma client

export async function GET(req: NextRequest) {
    const token = req.cookies.get('token')?.value; // Get token from cookies

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Decode and verify the token
        const decoded = verifyToken(token);

        if (typeof decoded === 'string' || !decoded?.email) {
            throw new Error('Invalid token');
        }

        // Fetch user from the database using the decoded email
        const user = await prisma.user.findUnique({
            where: { email: decoded.email },
            select: {
                email: true,
                name: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            user: { name: user.name, email: user.email },
        });
    } catch (err) {
        console.error('Error verifying token:', err);
        return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }
}
