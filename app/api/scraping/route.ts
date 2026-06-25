import { NextResponse } from "next/server";

export async function GET() {
    const response = await fetch('https://crawl-target-server.vercel.app/api/products?category=living&page=1&pageSize=3');
    const data = await response.json()

    
}