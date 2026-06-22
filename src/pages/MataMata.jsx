import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/ui/PageHeader";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { getTeamInfo, STAGE_LABELS } from "@/lib/copa-data";

function BracketMatch({ match }) {
    const home = getTeamInfo(match.home_team);
    const away = getTeamInfo(match.away_team);
    const isFinished = match.status === "finished";
    const homeWon = isFinished && match.home_score > match.away_score;
    const awayWon = isFinished && match.away_score > match.home_score;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-border bg-card overflow-hidden w-full max-w-xs"
        >
            <div className={`flex items-center justify-between px-3 py-2.5 border-b border-border/50 ${homeWon ? "bg-primary/5" : ""
                }`}>
                <div className="flex items-center gap-2">
                    <span className="text-lg">{home.flag}</span>
                    <span className={`text-sm font-medium ${homeWon ? "font-bold text-primary" : ""}`}>
                        {match.home_team || "A definir"}
                    </span>
                </div>
                <span className={`text-lg font-bold tabular-nums ${homeWon ? "text-primary" : ""}`}>
                    {match.home_score ?? "-"}
                </span>
            </div>
            <div className={`flex items-center justify-between px-3 py-2.5 ${awayWon ? "bg-primary/5" : ""
                }`}>
                <div className="flex items-center gap-2">
                    <span className="text-lg">{away.flag}</span>
                    <span className={`text-sm font-medium ${awayWon ? "font-bold text-primary" : ""}`}>
                        {match.away_team || "A definir"}
                    </span>
                </div>
                <span className={`text-lg font-bold tabular-nums ${awayWon ? "text-primary" : ""}`}>
                    {match.away_score ?? "-"}
                </span>
            </div>
        </motion.div>
    );
}

export default function MataMata() {
    const { data: matches = [], isLoading } = useQuery({
        queryKey: ["matches-knockout"],
        queryFn: () => base44.entities.Match.list("-kickoff_at", 200),
    });

    const stages = ["round_of_16", "quarter_final", "semi_final", "third_place", "final"];

    const knockoutMatches = useMemo(() => {
        const grouped = {};
        stages.forEach((s) => {
            grouped[s] = matches
                .filter((m) => m.stage === s)
                .sort((a, b) => (a.match_number || 0) - (b.match_number || 0));
        });
        return grouped;
    }, [matches]);

    return (
        <div className="space-y-6">
            <PageHeader icon={GitBranch} title="Mata-Mata" subtitle="Fase eliminatória da Copa" />

            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} rows={3} />)}
                </div>
            ) : (
                <div className="space-y-8">
                    {stages.map((stage) => {
                        const stageMatches = knockoutMatches[stage] || [];
                        if (stageMatches.length === 0) return null;
                        return (
                            <section key={stage}>
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className="bg-primary/10 text-primary border-primary/20 font-display font-bold">
                                        {STAGE_LABELS[stage]}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        ({stageMatches.length} {stageMatches.length === 1 ? "jogo" : "jogos"})
                                    </span>
                                </div>
                                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center">
                                    {stageMatches.map((match) => (
                                        <BracketMatch key={match.id} match={match} />
                                    ))}
                                </div>
                            </section>
                        );
                    })}

                    {Object.values(knockoutMatches).every((arr) => arr.length === 0) && (
                        <div className="text-center py-12 text-muted-foreground">
                            <GitBranch className="w-10 h-10 mx-auto mb-3 opacity-40" />
                            <p className="text-sm">O mata-mata será preenchido automaticamente após a fase de grupos</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}