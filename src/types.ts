export enum MenuCategory {
    HOME = "홈",
    SALES = "매출 부스트 솔루션",
    EQUIPMENT = "장비/시설 케어",
    RISK = "리스크 관리 솔루션",
    APPS = "비즈니스+ APPs",
    MYPAGE = "마이페이지",
    PRICING = "멤버십 플랜",
    ADMIN = "시스템 관리",
    PRODUCT_MGMT = "상품 관리",
    LOGIN = "로그인",
    REGISTER = "멤버십 신청",
    LANDING = "랜딩페이지",
    ORDER_MANAGE = "발주/재료 관리",
    INGREDIENT_ORDER = "재료 주문",
    RESOURCES = "자료실",
    STORE_MGMT = "매장 관리",
}

export interface User {
    email: string;
    name: string;
    role: 'user' | 'admin';
    membership: 'none' | 'basic' | 'plus' | 'egg120' | 'pie120' | 'cafe120';
    status: 'pending' | 'active';
    businessName?: string;
    phone?: string;
    address?: string;
    detailAddress?: string;
}

export interface Product {
    _id?: string;
    id: string;
    name: string;
    description: string;
    features: string[];
    commitment?: string;
    price: string;
    installments: string;
    initial: string;
    image: string;
    color: string;
    isPremium: boolean;
    active: boolean;
    storageId?: string;
}

export interface Lead {
    id: string;
    productId: string;
    productName: string;
    name: string;
    phone: string;
    email?: string;
    businessName?: string;
    message?: string;
    status: 'pending' | 'completed';
    createdAt: string;
}

export interface Resource {
    _id: string;
    title: string;
    description?: string;
    type: 'image' | 'video' | 'file';
    fileUrl: string;
    fileStorageId?: string;
    thumbnailUrl?: string;
    thumbnailStorageId?: string;
    createdAt: number;
}

export interface Store {
    _id: string;
    registrationDate: string;
    storeName: string;
    ownerName: string;
    mobilePhone: string;
    storePhone: string;
    email: string;
    status: '영업중' | '폐업' | '계약종료';
    address: string;
    detailAddress: string;
    remarks?: string;
    createdAt: number;
}
