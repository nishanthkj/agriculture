import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// DELETE Worker by ID
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // Adjusted to Promise
) {
  try {
    const { id } = await context.params; // Awaiting the Promise

    if (!id) {
      return NextResponse.json({ error: 'Worker ID is required' }, { status: 400 });
    }

    const deleted = await prisma.worker.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Worker deleted', data: deleted }, { status: 200 });
  } catch (error) {
    console.error('Error deleting worker:', error);
    return NextResponse.json({ error: 'Failed to delete worker' }, { status: 500 });
  }
}

// PUT: Update Worker Cost by ID
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // Adjusted to Promise
) {
  try {
    const { id } = await context.params; // Awaiting the Promise
    const { cost } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Worker ID is required' }, { status: 400 });
    }

    const updated = await prisma.worker.update({
      where: { id },
      data: { cost },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating worker:', error);
    return NextResponse.json({ error: 'Failed to update worker' }, { status: 500 });
  }
}
