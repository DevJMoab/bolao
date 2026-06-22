import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import {
    Trophy, Calendar, GitBranch, Sliders, BarChart3,
    Target, BookOpen, ArrowRight, Flame
} from "lucide-react";
import { Card } from "@/components/ui/card";
import MatchCard from "@/components/matches/MatchCard";
import SkeletonCard from "@/components/ui/SkeletonCard";

const QUICK_LINKS = [
    { path: "/tabela", icon: Trophy, label: "Tabela", color: "bg-primary/10 text-primary" },
    { path: "/jogos", icon: Calendar, label: "Jogos", color: "bg-blue-500/10 text-blue-500" },
    { path: "/mata-mata", icon: GitBranch, label: "Mata-Mata", color: "bg-purple-500/10 text-purple-500" },
    { path: "/simulador", icon: Sliders, label: "Simulador", color: "bg-orange-500/10 text-orange-500" },
    { path: "/estatisticas", icon: BarChart3, label: "Stats", color: "bg-cyan-500/10 text-cyan-500" },
    { path: "/bolao", icon: Target, label: "Bolão", color: "bg-red-500/10 text-red-500" },
    { path: "/curiosidades", icon: BookOpen, label: "Curiosidades", color: "bg-yellow-500/10 text-yellow-500" },
];

export default function Home() {
    const { user } = useAuth();

    const { data: matches = [], isLoading } = useQuery({
        queryKey: ["matches-home"],
        queryFn: () => base44.entities.Match.list("-kickoff_at", 50),
    });

    const liveMatches = matches.filter((m) => m.status === "live");
    const upcomingMatches = matches
        .filter((m) => m.status === "scheduled")
        .sort((a, b) => new Date(a.kickoff_at) - new Date(b.kickoff_at))
        .slice(0, 3);
    const recentMatches = matches
        .filter((m) => m.status === "finished")
        .slice(0, 3);

    return (
        <div className="space-y-8">
            {/* Hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-secondary/10 border border-primary/20 p-6 md:p-8"
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                        <Trophy className="w-6 h-6 text-secondary" />
                        <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
                            Copa do Mundo 2026
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                        Olá, <span className="text-gradient">{user?.full_name?.split(" ")[0] || "Craque"}</span>! ⚽
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base max-w-lg">
                        Acompanhe todos os jogos, faça seus palpites e dispute com seus amigos no maior bolão da Copa!
                    </p>
                </div>
            </motion.div>

            {/* Quick Links */}
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2 md:gap-3">
                {QUICK_LINKS.map((item, i) => (
                    <motion.div
                        key={item.path}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Link
                            to={item.path}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all group"
                        >
                            <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                                {item.label}
                            </span>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Live Matches */}
            {liveMatches.length > 0 && (
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Flame className="w-5 h-5 text-red-500" />
                        <h2 className="text-lg font-display font-bold">Ao Vivo Agora</h2>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                        {liveMatches.map((match) => (
                            <MatchCard key={match.id} match={match} />
                        ))}
                    </div>
                </section>
            )}

            {/* Upcoming */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-display font-bold">Próximos Jogos</h2>
                    <Link to="/jogos" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
                        Ver todos <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
                {isLoading ? (
                    <div className="grid gap-3 md:grid-cols-2">
                        {[1, 2].map((i) => <SkeletonCard key={i} rows={2} />)}
                    </div>
                ) : upcomingMatches.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2">
                        {upcomingMatches.map((match) => (
                            <MatchCard key={match.id} match={match} />
                        ))}
                    </div>
                ) : (
                    <Card className="p-8 text-center text-muted-foreground">
                        <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Nenhum jogo agendado ainda</p>
                    </Card>
                )}
            </section>

            {/* Recent Results */}
            {recentMatches.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-display font-bold">Resultados Recentes</h2>
                        <Link to="/jogos?filter=finished" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
                            Ver todos <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                        {recentMatches.map((match) => (
                            <MatchCard key={match.id} match={match} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}