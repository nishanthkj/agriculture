import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

interface JwtPayload { id: string; }

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded = verifyToken(token) as JwtPayload;
  if (!decoded?.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const record = await prisma.soilData.findFirst({ where: { userId: decoded.id } });
  return NextResponse.json({ success: true, data: record || null });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded = verifyToken(token) as JwtPayload;
  if (!decoded?.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const body = await req.json();
  const { N, P, K, pH, EC, OC, S, Zn, Fe, Cu, Mn, B, fertilityClass, confidence } = body;

  const values = [N, P, K, pH, EC, OC, S, Zn, Fe, Cu, Mn, B];
  if (values.some(val => val === undefined || isNaN(val)) || fertilityClass === undefined || confidence === undefined) {
    return NextResponse.json({ error: 'Missing or invalid data' }, { status: 400 });
  }

  const record = await prisma.soilData.create({
    data: {
      userId: decoded.id,
      N, P, K, pH, EC, OC, S, Zn, Fe, Cu, Mn, B,
      fertilityClass,
      confidence
    }
  });

  return NextResponse.json({ success: true, record });
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded = verifyToken(token) as JwtPayload;
  if (!decoded?.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const body = await req.json();
  const { N, P, K, pH, EC, OC, S, Zn, Fe, Cu, Mn, B, fertilityClass, confidence } = body;

  const values = [N, P, K, pH, EC, OC, S, Zn, Fe, Cu, Mn, B];
  if (values.some(val => val === undefined || isNaN(val)) || fertilityClass === undefined || confidence === undefined) {
    return NextResponse.json({ error: 'Missing or invalid data' }, { status: 400 });
  }

  const existing = await prisma.soilData.findFirst({ where: { userId: decoded.id } });
  if (!existing) return NextResponse.json({ error: 'Record not found to update' }, { status: 404 });

  const record = await prisma.soilData.update({
    where: { id: existing.id },
    data: {
      N, P, K, pH, EC, OC, S, Zn, Fe, Cu, Mn, B,
      fertilityClass,
      confidence
    }
  });

  return NextResponse.json({ success: true, record });
}
