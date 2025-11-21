import React from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    Users,
    Package,
    FileText,
    Calendar,
    Settings,
    LogOut,
    Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: FileText, label: 'Service Orders', href: '/dashboard/orders' },
    { icon: Users, label: 'Clients', href: '/dashboard/clients' },
    { icon: Package, label: 'Products & Services', href: '/dashboard/products' },
    { icon: Package, label: 'Inventory', href: '/dashboard/inventory' },
    { icon: Calendar, label: 'Schedule', href: '/dashboard/schedule' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-gray-800 border-r">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-primary">Manager</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50">
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </Button>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <div className="flex-1 flex flex-col">
                <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b">
                    <h1 className="text-xl font-bold">Manager</h1>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <div className="p-6 border-b">
                                <h2 className="text-2xl font-bold text-primary">Manager</h2>
                            </div>
                            <nav className="flex-1 p-4 space-y-2">
                                {sidebarItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                                <div className="pt-4 mt-4 border-t">
                                    <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50">
                                        <LogOut className="w-5 h-5" />
                                        <span>Logout</span>
                                    </Button>
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </header>

                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
