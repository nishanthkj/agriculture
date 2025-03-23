import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

interface JwtPayload {
  id: string;
  email: string;
}

// GET /api/workers - Fetch workers based on userId
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Decode the token to get userId
    const decoded = verifyToken(token) as JwtPayload;

    // Check if the token contains userId
    if (!decoded?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch workers associated with the userId
    const workers = await prisma.worker.findMany({
      where: {
        userId: decoded.id, // Query workers by userId
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Return the fetched workers
    return NextResponse.json(workers);
  } catch (error) {
    console.error('❌ Error in GET /api/workers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/workers - Create a new worker entry
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Decode the token to get userId
    const decoded = verifyToken(token) as JwtPayload;

    // Check if the token contains userId
    if (!decoded?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, role, farm, cost } = await req.json();
    if (!name || !role || !farm || !cost) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a new worker entry
    const worker = await prisma.worker.create({
      data: {
        name,
        role,
        farm,
        userId: decoded.id,  // Associate the worker with the logged-in user
        cost: parseFloat(cost),
      },
    });

    // Return the created worker
    return NextResponse.json(worker);
  } catch (error) {
    console.error('❌ Error in POST /api/workers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
