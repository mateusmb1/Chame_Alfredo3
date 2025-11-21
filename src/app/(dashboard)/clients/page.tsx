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
import { Label } from "@/components/ui/label"
import { Plus, Search, Trash2, Edit } from "lucide-react"
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

const clientSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Phone must be at least 10 characters"),
    address: z.string().min(5, "Address must be at least 5 characters"),
})

export default function ClientsPage() {
    const { clients, addClient, deleteClient } = useMockData()
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const form = useForm<z.infer<typeof clientSchema>>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
        },
    })

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    function onSubmit(values: z.infer<typeof clientSchema>) {
        addClient(values)
        setIsDialogOpen(false)
        form.reset()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Clients</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Client
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Client</DialogTitle>
                            <DialogDescription>
                                Enter the client details below.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="john@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <Input placeholder="(11) 99999-9999" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Street A, 123" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit">Save Client</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredClients.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell className="font-medium">{client.name}</TableCell>
                                <TableCell>{client.email}</TableCell>
                                <TableCell>{client.phone}</TableCell>
                                <TableCell>{client.address}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => deleteClient(client.id)}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredClients.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    No clients found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
