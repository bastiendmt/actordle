import { NextResponse } from 'next/server';
import data from './actors.json';

export async function GET(request?: Request) {
  console.log(new Date());
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const newData = {};
}
