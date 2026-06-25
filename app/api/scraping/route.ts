import { NextResponse } from "next/server";

const BASE_URL = 'https://crawl-target-server.vercel.app'
const API_ENDPOINT = '/api/products'

export async function GET(request: Request) {
    
    const {searchParams} = new URL(request.url);

    const category = searchParams.get('category') || 'all';
    const allProducts: any[] = [];
    
    let currentPage = 1;
    let hasMorePages = true;

    console.log(`카테고리 "${category}"의 모든 상품 수집 시작...`);

    while (hasMorePages) {
        const apiUrl = `${BASE_URL}${API_ENDPOINT}?category=${category}&page=${currentPage}&pageSize=10`;
    
        console.log(`페이지 ${currentPage} 처리 중...`);

        const response = await fetch(apiUrl);
        const data = await response.json();

        await new Promise(resolve => setTimeout(resolve, 100));

        if (data.products && data.products.length > 0) {
            allProducts.push(...data.products);
            console.log(`페이지 ${currentPage}: ${data.products.length}개 상품 추가`);

            if (data.pagination.hasNextPage) {
                currentPage++;
            }
            else {
                hasMorePages = false;
                console.log(`페이지 ${currentPage}에서 ${data.products.length}개 상품 발견 - 마지막 페이지`);
            }
        }
    }

    allProducts.forEach((product:any, index:number) => {
        console.log(`${index + 1}번째 상품: ${product.name}, W${product.price.toLocaleString()}`);
    })

    console.log(`총 ${allProducts.length}개 상품 수집 완료`);

    return NextResponse.json({
        success: true,
        data: allProducts,
        total: allProducts.length,
        category: category,
        pagesProcessed: currentPage
        }
    );
}