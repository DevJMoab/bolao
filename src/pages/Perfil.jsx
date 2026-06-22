import React from "react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { User, Mail, Trophy, Target, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/ui/PageHeader";

export default function Perfil() {
    const { user } = useAuth();

    const { data: standings = [] } = useQuery({
        queryKey: ["my-standing"],
        queryFn: async () => {
            if (!user?.id) return [];
            return base44.entities.Standing.filter({ created_by_id: user.id });
        },
        enabled: !!user?.id,
    });

    const myStanding = standings[0];

    const handleLogout = () => {
        base44.auth.logout("/login");
    };

    return (
        <div className="space-y-6 max-w-lg mx-auto">
            <PageHeader icon={User} title="Meu Perfil" />

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <User className="w-10 h-10 text-primary" />
                            </div>
                            <h2 className="text-xl font-display font-bold">{user?.full_name || "Jogador"}</h2>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                                <Mail className="w-3.5 h-3.5" />
                                {user?.email}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                <Card>
                    <CardContent className="p-4 text-center">
                        <Trophy className="w-6 h-6 text-secondary mx-auto mb-2" />
                        <p className="text-2xl font-display font-bold">{myStanding?.total_points || 0}</p>
                        <p className="text-xs text-muted-foreground">Pontos Totais</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <Target className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-2xl font-display font-bold">{myStanding?.rank_position || "-"}</p>
                        <p className="text-xs text-muted-foreground">Posição no Ranking</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-display font-bold text-green-500">{myStanding?.exact_scores || 0}</p>
                        <p className="text-xs text-muted-foreground">Placares Exatos</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-display font-bold text-yellow-500">{myStanding?.correct_outcomes || 0}</p>
                        <p className="text-xs text-muted-foreground">Acertos de Resultado</p>
                    </CardContent>
                </Card>
            </div>

            <Button variant="outline" className="w-full gap-2 text-destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                Sair da Conta
            </Button>
        </div>
    );
}