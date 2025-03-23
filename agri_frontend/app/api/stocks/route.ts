import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

interface JwtPayload {
  id: string;
  email: string;
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token) as JwtPayload;
    if (!decoded?.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const body = await req.json();
    const { name, quantity, location, cost, sellingPrice } = body;

    if (!name || !quantity || !location || !cost || !sellingPrice) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const stock = await prisma.stock.create({
      data: {
        name,
        quantity: parseInt(quantity),
        location,
        cost: parseFloat(cost),
        sellingPrice: parseFloat(sellingPrice),
        userId: decoded.id,
      },
    });

    return NextResponse.json(stock);
  } catch (error) {
    console.error('❌ Error in POST /api/stocks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
export async function GET(req: NextRequest) {
  try {
    // Retrieve the token from cookies
    const token = req.cookies.get('token')?.value;
    console.log('Received token:', token); // Log the received token

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Decode the token to get userId
    const decoded = verifyToken(token) as JwtPayload;
    console.log('Decoded token:', decoded); // Log the decoded token

    // Check if the token contains userId
    if (!decoded?.id) {
      console.error('Decoded token does not contain userId');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Log the userId for debugging
    console.log('User ID from decoded token:', decoded.id);

    // Fetch stocks associated with the userId
    const stocks = await prisma.stock.findMany({
      where: {
        userId: decoded.id, // Query based on userId
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('Fetched stocks:', stocks); // Log the fetched stocks

    // Check if no stocks were found for this user
    if (stocks.length === 0) {
      console.log('No stocks found for user with userId:', decoded.id);
    }

    return NextResponse.json(stocks); // Return the fetched stocks
  } catch (error) {
    console.error('❌ Error in GET /api/stocks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
