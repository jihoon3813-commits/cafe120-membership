export enum MenuCategory {
    HOME = "홈",
    SALES = "매출 부스트 솔루션",
    EQUIPMENT = "장비/시설 케어",
    RISK = "리스크 관리 솔루션",
    APPS = "비즈니스+ APPs",
    MYPAGE = "마이페이지",
    PRICING = "멤버십 가이드",
    ADMIN = "시스템 관리",
    LOGIN = "로그인",
    REGISTER = "멤버십 신청"
}

export interface User {
    email: string;
    name: string;
    role: 'user' | 'admin';
    membership: 'none' | 'basic' | 'plus';
    status: 'pending' | 'active';
    businessName?: string;
    phone?: string;
    address?: string;
    detailAddress?: string;
}
