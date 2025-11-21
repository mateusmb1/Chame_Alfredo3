"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Product, Order, OrderStatus, ProductType } from '@/types';

interface MockDataContextType {
    clients: Client[];
    products: Product[];
    orders: Order[];
    addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
    updateClient: (id: string, client: Partial<Client>) => void;
    deleteClient: (id: string) => void;
    addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
    updateProduct: (id: string, product: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'clientName'>) => void;
    updateOrder: (id: number, order: Partial<Order>) => void;
    deleteOrder: (id: number) => void;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export function MockDataProvider({ children }: { children: React.ReactNode }) {
    // Initial Mock Data
    const [clients, setClients] = useState<Client[]>([
        { id: '1', name: 'João Silva', email: 'joao@gmail.com', phone: '11999999999', address: 'Rua A, 123', createdAt: new Date() },
        { id: '2', name: 'Maria Souza', email: 'maria@hotmail.com', phone: '11888888888', address: 'Av B, 456', createdAt: new Date() },
    ]);

    const [products, setProducts] = useState<Product[]>([
        { id: '1', name: 'Instalação de Câmera', price: 150.00, stock: 0, type: 'SERVICE', createdAt: new Date() },
        { id: '2', name: 'Câmera IP', price: 250.00, costPrice: 180.00, stock: 10, type: 'PRODUCT', createdAt: new Date() },
        { id: '3', name: 'Manutenção Elétrica', price: 100.00, stock: 0, type: 'SERVICE', createdAt: new Date() },
    ]);

    const [orders, setOrders] = useState<Order[]>([
        {
            id: 1001,
            clientId: '1',
            clientName: 'João Silva',
            status: 'PENDING',
            totalAmount: 400.00,
            createdAt: new Date(),
            items: [
                { id: '1', productId: '1', productName: 'Instalação de Câmera', quantity: 1, price: 150.00 },
                { id: '2', productId: '2', productName: 'Câmera IP', quantity: 1, price: 250.00 }
            ]
        }
    ]);

    const addClient = (data: Omit<Client, 'id' | 'createdAt'>) => {
        const newClient = { ...data, id: Math.random().toString(36).substr(2, 9), createdAt: new Date() };
        setClients([...clients, newClient]);
    };

    const updateClient = (id: string, data: Partial<Client>) => {
        setClients(clients.map(c => c.id === id ? { ...c, ...data } : c));
    };

    const deleteClient = (id: string) => {
        setClients(clients.filter(c => c.id !== id));
    };

    const addProduct = (data: Omit<Product, 'id' | 'createdAt'>) => {
        const newProduct = { ...data, id: Math.random().toString(36).substr(2, 9), createdAt: new Date() };
        setProducts([...products, newProduct]);
    };

    const updateProduct = (id: string, data: Partial<Product>) => {
        setProducts(products.map(p => p.id === id ? { ...p, ...data } : p));
    };

    const deleteProduct = (id: string) => {
        setProducts(products.filter(p => p.id !== id));
    };

    const addOrder = (data: Omit<Order, 'id' | 'createdAt' | 'clientName'>) => {
        const client = clients.find(c => c.id === data.clientId);
        const newOrder = {
            ...data,
            id: Math.floor(Math.random() * 10000) + 1000,
            clientName: client?.name || 'Unknown',
            createdAt: new Date()
        };
        setOrders([...orders, newOrder]);
    };

    const updateOrder = (id: number, data: Partial<Order>) => {
        setOrders(orders.map(o => o.id === id ? { ...o, ...data } : o));
    };

    const deleteOrder = (id: number) => {
        setOrders(orders.filter(o => o.id !== id));
    };

    return (
        <MockDataContext.Provider value={{
            clients, products, orders,
            addClient, updateClient, deleteClient,
            addProduct, updateProduct, deleteProduct,
            addOrder, updateOrder, deleteOrder
        }}>
            {children}
        </MockDataContext.Provider>
    );
}

export function useMockData() {
    const context = useContext(MockDataContext);
    if (context === undefined) {
        throw new Error('useMockData must be used within a MockDataProvider');
    }
    return context;
}
