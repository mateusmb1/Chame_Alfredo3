"use client"

import { useMockData } from "@/contexts/MockDataContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, FileText, DollarSign, TrendingUp, AlertCircle } from "lucide-react"

export default function DashboardPage() {
    const { clients, products, orders } = useMockData()

    const totalClients = clients.length
    const totalProducts = products.length
    const totalOrders = orders.length
    const totalRevenue = orders
        .filter(o => o.status !== 'CANCELED')
        .reduce((acc, order) => acc + order.totalAmount, 0)

    const pendingOrders = orders.filter(o => o.status === 'PENDING').length
    const lowStockItems = products.filter(p => p.type === 'PRODUCT' && p.stock < 5).length

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalClients}</div>
                        <p className="text-xs text-muted-foreground">
                            +180.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            +19% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            {pendingOrders > 0 ? 'Requires attention' : 'All caught up'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {orders.slice(0, 5).map(order => (
                                <div key={order.id} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{order.clientName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {order.items.length} items
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        +${order.totalAmount.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                            {orders.length === 0 && (
                                <p className="text-center text-muted-foreground py-4">No recent orders</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Inventory Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            <div className="flex items-center">
                                <Package className="h-9 w-9 text-blue-500 bg-blue-100 p-2 rounded-full" />
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Total Products</p>
                                    <p className="text-sm text-muted-foreground">{totalProducts} items</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <AlertCircle className="h-9 w-9 text-yellow-500 bg-yellow-100 p-2 rounded-full" />
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Low Stock</p>
                                    <p className="text-sm text-muted-foreground">{lowStockItems} items</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
