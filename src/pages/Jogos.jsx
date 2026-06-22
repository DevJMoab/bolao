import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Calendar, Radio, CheckCircle2, Clock } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/ui/PageHeader";
import MatchCard from "@/components/matches/MatchCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { Card } from "@/components/ui/card";

export default function Jogos() {
    const [filter, setFilter] = useState("all");

    const { data: matches = [], isLoading } = useQuery({
        queryKey: ["matches-all"],
        queryFn: () => base44.entities.Match.list("-kickoff_at", 200),
        refetchInterval: 30000,
    });

    const filtered = useMemo(() => {
        let list = [...matches];
        if (filter === "live") list = list.filter((m) => m.status === "live");
        else if (filter === "finished") list = list.filter((m) => m.status === "finished");
        else if (filter === "scheduled") list = list.filter((m) => m.status === "scheduled");

        return list.sort((a, b) => {
            if (a.status === "live" && b.status !== "live") return -1;
            if (b.status === "live" && a.status !== "live") return 1;
            return new Date(a.kickoff_at).getTime() - new Date(b.kickoff_at).getTime();
        });
    }, [matches, filter]);

    const counts = useMemo(() => ({
        all: matches.length,
        live: matches.filter((m) => m.status === "live").length,
        finished: matches.filter((m) => m.status === "finished").length,
        scheduled: matches.filter((m) => m.status === "scheduled").length,
    }), [matches]);

    return (
        <div className="space-y-6">
            <PageHeader icon={Calendar} title="Jogos" subtitle="Todos os jogos da Copa do Mundo 2026" />

            <Tabs value={filter} onValueChange={setFilter}>
                <TabsList className="w-full grid grid-cols-4">
                    <TabsTrigger value="all" className="gap-1">
                        Todos <span className="text-xs opacity-60">({counts.all})</span>
                    </TabsTrigger>
                    <TabsTrigger value="live" className="gap-1">
                        <Radio className="w-3 h-3" /> Ao Vivo
                        {counts.live > 0 && <span className="text-xs text-red-500">({counts.live})</span>}
                    </TabsTrigger>
                    <TabsTrigger value="finished" className="gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Encerrados
                    </TabsTrigger>
                    <TabsTrigger value="scheduled" className="gap-1">
                        <Clock className="w-3 h-3" /> Próximos
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {isLoading ? (
                <div className="grid gap-3 md:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} rows={2} />)}
                </div>
            ) : filtered.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                    {filtered.map((match) => (
                        <MatchCard key={match.id} match={match} />
                    ))}
                </div>
            ) : (
                <Card className="p-8 text-center text-muted-foreground">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum jogo encontrado para este filtro</p>
                </Card>
            )}
        </div>
    );
}