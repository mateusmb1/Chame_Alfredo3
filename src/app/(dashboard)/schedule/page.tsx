"use client"

import { useMockData } from "@/contexts/MockDataContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User } from "lucide-react"

export default function SchedulePage() {
    const { orders } = useMockData()

    // Filter orders with scheduled dates and sort them
    const scheduledOrders = orders
        .filter(order => order.scheduledDate)
        .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime())

    // Group orders by date
    const groupedOrders = scheduledOrders.reduce((acc, order) => {
        const date = order.scheduledDate!.toLocaleDateString()
        if (!acc[date]) {
            acc[date] = []
        }
        acc[date].push(order)
        return acc
    }, {} as Record<string, typeof orders>)

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Schedule</h1>

            <div className="grid gap-6">
                {Object.entries(groupedOrders).map(([date, dateOrders]) => (
                    <div key={date} className="space-y-4">
                        <h2 className="text-xl font-semibold flex items-center text-gray-600 dark:text-gray-300">
                            <Calendar className="w-5 h-5 mr-2" />
                            {date}
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {dateOrders.map(order => (
                                <Card key={order.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Order #{order.id}
                                        </CardTitle>
                                        <Badge variant={order.status === 'COMPLETED' ? 'default' : 'secondary'}>
                                            {order.status}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3 mt-2">
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                <User className="w-4 h-4 mr-2" />
                                                {order.clientName}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                <Clock className="w-4 h-4 mr-2" />
                                                {order.scheduledDate?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                Client Address (Mock)
                                            </div>
                                            <div className="border-t pt-2 mt-2">
                                                <p className="text-xs text-gray-500 mb-1">Items:</p>
                                                <ul className="text-sm space-y-1">
                                                    {order.items.map((item, idx) => (
                                                        <li key={idx} className="flex justify-between">
                                                            <span>{item.productName}</span>
                                                            <span className="text-gray-500">x{item.quantity}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
                {scheduledOrders.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No scheduled orders found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
