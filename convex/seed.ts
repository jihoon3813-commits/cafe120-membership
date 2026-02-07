import { mutation } from "./_generated/server";

export const seedProducts = mutation({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db.query("products").take(1);
        if (products.length > 0) {
            console.log("Products already exist. Skipping seed.");
            return;
        }

        const initialProducts = [
            {
                id: 'egg120',
                name: 'egg120 Membership',
                description: '요즘 핫한 에그120을 부담없이 도입할 수 있는 멤버십 상품입니다.',
                features: ['샵인샵 풀패키지 제공', '머신 코팅 서비스 연 1회(총 2회)', '비즈니스+ APPs 제공', '리스크 케어 AI 서비스 제공'],
                commitment: '2년 약정',
                price: '99,000',
                installments: 'X 23회(2~24회)',
                initial: '최초 1회는 입회비 포함 100만원 결제',
                image: 'https://github.com/jihoon3813-commits/img_120/blob/main/%5B%ED%81%AC%EA%B8%B0%EB%B3%80%ED%99%98%5D%5B%ED%81%AC%EA%B8%B0%EB%B3%80%ED%99%98%5D240503_120%EA%B2%B9%ED%8C%8C%EC%9D%B40929%20(1).jpg?raw=true',
                color: 'orange',
                isPremium: false,
                active: true
            },
            {
                id: 'pie120',
                name: 'pie120 Membership',
                description: 'cafe120의 대표 브랜드인 120겹파이로 꾸준한 매출 상승 효과를 누려 보세요.',
                features: ['샵인샵 풀패키지 제공', '머신 코팅 서비스 연 1회(총 2회)', '비즈니스+ APPs 제공', '리스크 케어 AI 서비스 제공'],
                commitment: '2년 약정',
                price: '129,000',
                installments: 'X 23회(2~24회)',
                initial: '최초 1회는 입회비 포함 150만원 결제',
                image: 'https://github.com/jihoon3813-commits/img_120/blob/main/%EC%97%B0%EC%B6%9C_120%EA%B2%B9_2.jpg?raw=true',
                color: 'orange',
                isPremium: true,
                active: true
            }
        ];

        for (const p of initialProducts) {
            await ctx.db.insert("products", p);
        }
        console.log("Seeded initial products.");
    }
});
