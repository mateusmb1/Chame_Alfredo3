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
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Trash2, Package, Wrench } from "lucide-react"
import { useForm } from "react-hook-form"
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

const productSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Price must be positive"),
    costPrice: z.coerce.number().min(0, "Cost price must be positive").optional(),
    stock: z.coerce.number().min(0, "Stock must be positive"),
    type: z.enum(["PRODUCT", "SERVICE"]),
})

export default function ProductsPage() {
    const { products, addProduct, deleteProduct } = useMockData()
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            costPrice: 0,
            stock: 0,
            type: "PRODUCT",
        },
    })

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    function onSubmit(values: z.infer<typeof productSchema>) {
        addProduct(values)
        setIsDialogOpen(false)
        form.reset()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Products & Services</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Item
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Item</DialogTitle>
                            <DialogDescription>
                                Add a new product or service to your catalog.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="PRODUCT">Product</SelectItem>
                                                    <SelectItem value="SERVICE">Service</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Item name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="stock"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Stock</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="0" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Item description..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit">Save Item</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    {product.type === 'PRODUCT' ? (
                                        <div className="flex items-center text-blue-600">
                                            <Package className="w-4 h-4 mr-2" />
                                            Product
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-green-600">
                                            <Wrench className="w-4 h-4 mr-2" />
                                            Service
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>${product.price.toFixed(2)}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => deleteProduct(product.id)}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredProducts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    No products found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
