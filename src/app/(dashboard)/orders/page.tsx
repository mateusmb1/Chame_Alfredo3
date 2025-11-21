"use client"

import { useState } from "react"
import { useMockData } from "@/contexts/MockDataContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Trash2, FileText, Eye } from "lucide-react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"

const orderItemSchema = z.object({
    productId: z.string().min(1, "Product is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
})

const orderSchema = z.object({
    clientId: z.string().min(1, "Client is required"),
    items: z.array(orderItemSchema).min(1, "At least one item is required"),
    status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELED"]),
})

export default function OrdersPage() {
    const { orders, clients, products, addOrder, deleteOrder } = useMockData()
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const form = useForm<z.infer<typeof orderSchema>>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            clientId: "",
            items: [{ productId: "", quantity: 1 }],
            status: "PENDING",
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    })

    const filteredOrders = orders.filter(order =>
        order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm)
    )

    function onSubmit(values: z.infer<typeof orderSchema>) {
        const orderItems = values.items.map(item => {
            const product = products.find(p => p.id === item.productId)!
            return {
                id: Math.random().toString(36).substr(2, 9),
                productId: item.productId,
                productName: product.name,
                quantity: item.quantity,
                price: product.price
            }
        })

        const totalAmount = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

        addOrder({
            clientId: values.clientId,
            status: values.status,
            items: orderItems,
            totalAmount,
            notes: ""
        })

        setIsDialogOpen(false)
        form.reset()
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-500 hover:bg-green-600';
            case 'IN_PROGRESS': return 'bg-blue-500 hover:bg-blue-600';
            case 'CANCELED': return 'bg-red-500 hover:bg-red-600';
            default: return 'bg-yellow-500 hover:bg-yellow-600';
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Service Orders</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            New Order
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Create New Order</DialogTitle>
                            <DialogDescription>
                                Create a new service order for a client.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="clientId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Client</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a client" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {clients.map(client => (
                                                        <SelectItem key={client.id} value={client.id}>
                                                            {client.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <FormLabel>Items</FormLabel>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => append({ productId: "", quantity: 1 })}
                                        >
                                            Add Item
                                        </Button>
                                    </div>
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex gap-4 items-end">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.productId`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select product/service" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {products.map(product => (
                                                                    <SelectItem key={product.id} value={product.id}>
                                                                        {product.name} - ${product.price}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.quantity`}
                                                render={({ field }) => (
                                                    <FormItem className="w-24">
                                                        <FormControl>
                                                            <Input type="number" min="1" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => remove(index)}
                                                disabled={fields.length === 1}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="PENDING">Pending</SelectItem>
                                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                                    <SelectItem value="CANCELED">Canceled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <DialogFooter>
                                    <Button type="submit">Create Order</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order #</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">#{order.id}</TableCell>
                                <TableCell>{order.clientName}</TableCell>
                                <TableCell>
                                    <Badge className={getStatusColor(order.status)}>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
                                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon">
                                            <Eye className="w-4 h-4 text-gray-500" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => deleteOrder(order.id)}>
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredOrders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    No orders found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
