import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation: check if body has the expected structure
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Assuming body is an object with question ratings
    // You can add more specific validation here

    const collection = await getCollection('Forms-data', 'faceValidity');
    const result = await collection.insertOne({
      ...body,
      submittedAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 200 });
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}