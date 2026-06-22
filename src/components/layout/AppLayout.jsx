import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Trophy, Calendar, GitBranch, Sliders, BarChart3,
    Target, BookOpen, User, Menu, X, LogOut, Home
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

const NAV_ITEMS = [
    { path: "/", icon: Home, label: "Início" },
    { path: "/tabela", icon: Trophy, label: "Tabela" },
    { path: "/jogos", icon: Calendar, label: "Jogos" },
    { path: "/mata-mata", icon: GitBranch, label: "Mata-Mata" },
    { path: "/simulador", icon: Sliders, label: "Simulador" },
    { path: "/estatisticas", icon: BarChart3, label: "Estatísticas" },
    { path: "/bolao", icon: Target, label: "Bolão" },
    { path: "/curiosidades", icon: BookOpen, label: "Curiosidades" },
];

export default function AppLayout() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { user } = useAuth();

    const handleLogout = () => {
        base44.auth.logout("/login");
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-border/50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-display font-bold text-lg hidden sm:block">
                            Bolão<span className="text-primary">Copa</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {NAV_ITEMS.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${isActive
                                            ? "text-primary bg-accent"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-2">
                        <Link
                            to="/perfil"
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <User className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium hidden md:block">
                                {user?.full_name || "Perfil"}
                            </span>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground">
                            <LogOut className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Nav */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="lg:hidden border-t border-border/50 overflow-hidden"
                        >
                            <nav className="p-4 grid grid-cols-2 gap-2">
                                {NAV_ITEMS.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                }`}
                                        >
                                            <item.icon className="w-4 h-4" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Bottom Mobile Nav */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glass border-t border-border/50 safe-area-pb">
                <div className="flex justify-around items-center h-16 px-2">
                    {NAV_ITEMS.slice(0, 5).map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-all ${isActive ? "text-primary" : "text-muted-foreground"
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? "scale-110" : ""} transition-transform`} />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6 pb-24 lg:pb-6">
                <Outlet />
            </main>
        </div>
    );
}