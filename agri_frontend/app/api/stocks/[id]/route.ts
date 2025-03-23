import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// DELETE Route
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // Directly destructure id from params

    if (!id) {
      return NextResponse.json({ error: 'Stock ID is required' }, { status: 400 });
    }

    // Prisma expects the ID to match the type in the schema (string in this case)
    const deleted = await prisma.stock.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Stock deleted', data: deleted }, { status: 200 });
  } catch (error) {
    console.error('Error deleting stock:', error);
    return NextResponse.json({ error: 'Failed to delete stock' }, { status: 500 });
  }
}

// PUT Route

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Await the params to resolve the Promise
    const { id } = await context.params;
    const { quantity, cost, sellingPrice } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Stock ID is required' }, { status: 400 });
    }

    const updated = await prisma.stock.update({
      where: { id },
      data: {
        quantity,
        cost,
        sellingPrice,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
  }
}
