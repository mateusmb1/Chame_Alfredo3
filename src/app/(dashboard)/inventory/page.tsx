"use client"

import { useMockData } from "@/contexts/MockDataContext"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Package } from "lucide-react"

export default function InventoryPage() {
    const { products } = useMockData()

    // Filter only products (not services)
    const inventoryItems = products.filter(p => p.type === 'PRODUCT')

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-500', icon: AlertTriangle }
        if (stock < 5) return { label: 'Low Stock', color: 'bg-yellow-500', icon: AlertTriangle }
        return { label: 'In Stock', color: 'bg-green-500', icon: CheckCircle }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Inventory Control</h1>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Products</p>
                            <h3 className="text-2xl font-bold">{inventoryItems.length}</h3>
                        </div>
                        <Package className="w-8 h-8 text-blue-500 opacity-50" />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
                            <h3 className="text-2xl font-bold text-yellow-600">
                                {inventoryItems.filter(p => p.stock > 0 && p.stock < 5).length}
                            </h3>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-yellow-500 opacity-50" />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Out of Stock</p>
                            <h3 className="text-2xl font-bold text-red-600">
                                {inventoryItems.filter(p => p.stock === 0).length}
                            </h3>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-red-500 opacity-50" />
                    </div>
                </div>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Current Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Value (Est.)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inventoryItems.map((product) => {
                            const status = getStockStatus(product.stock)
                            return (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell>
                                        <Badge className={`${status.color} hover:${status.color}`}>
                                            <status.icon className="w-3 h-3 mr-1" />
                                            {status.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>${(product.price * product.stock).toFixed(2)}</TableCell>
                                </TableRow>
                            )
                        })}
                        {inventoryItems.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    No products found in inventory
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
