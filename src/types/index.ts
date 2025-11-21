export type Role = 'ADMIN' | 'USER';

export type User = {
    id: string;
    name: string;
    email: string;
    role: Role;
};

export type Client = {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    createdAt: Date;
};

export type ProductType = 'PRODUCT' | 'SERVICE';

export type Product = {
    id: string;
    name: string;
    description?: string;
    price: number;
    costPrice?: number;
    stock: number;
    type: ProductType;
    createdAt: Date;
};

export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';

export type OrderItem = {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
};

export type Order = {
    id: number;
    clientId: string;
    clientName: string;
    status: OrderStatus;
    totalAmount: number;
    scheduledDate?: Date;
    createdAt: Date;
    items: OrderItem[];
    notes?: string;
};
