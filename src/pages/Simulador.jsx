import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Sliders, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/components/ui/PageHeader";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { GROUPS_2026, getTeamInfo } from "@/lib/copa-data";

function buildStandings(matches, teams) {
    const s = {};
    teams.forEach((t) => { s[t] = { team: t, played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, points: 0 }; });
    matches.forEach((m) => {
        if (m.home_score == null || m.away_score == null) return;
        const h = s[m.home_team]; const a = s[m.away_team];
        if (!h || !a) return;
        h.played++; a.played++;
        h.gf += m.home_score; h.ga += m.away_score;
        a.gf += m.away_score; a.ga += m.home_score;
        h.gd = h.gf - h.ga; a.gd = a.gf - a.ga;
        if (m.home_score > m.away_score) { h.wins++; h.points += 3; a.losses++; }
        else if (m.home_score < m.away_score) { a.wins++; a.points += 3; h.losses++; }
        else { h.draws++; h.points += 1; a.draws++; a.points += 1; }
    });
    return Object.values(s).sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
}

export default function Simulador() {
    const [selectedGroup, setSelectedGroup] = useState("A");
    const [simScores, setSimScores] = useState({});

    const { data: allMatches = [], isLoading } = useQuery({
        queryKey: ["matches-sim"],
        queryFn: () => base44.entities.Match.filter({ stage: "group" }),
    });

    const groupMatches = useMemo(() =>
        allMatches.filter((m) => m.group_name === selectedGroup),
        [allMatches, selectedGroup]
    );

    const simulatedMatches = useMemo(() =>
        groupMatches.map((m) => ({
            ...m,
            home_score: simScores[m.id]?.home ?? m.home_score,
            away_score: simScores[m.id]?.away ?? m.away_score,
        })),
        [groupMatches, simScores]
    );

    const standings = useMemo(() =>
        buildStandings(simulatedMatches, GROUPS_2026[selectedGroup] || []),
        [simulatedMatches, selectedGroup]
    );

    const updateScore = (matchId, side, value) => {
        const num = value === "" ? null : parseInt(value);
        setSimScores((prev) => ({
            ...prev,
            [matchId]: { ...prev[matchId], [side]: isNaN(num) ? null : num },
        }));
    };

    const resetSimulation = () => setSimScores({});

    return (
        <div className="space-y-6">
            <PageHeader icon={Sliders} title="Simulador" subtitle="Simule resultados e veja como fica a classificação" />

            <div className="flex items-center gap-3 flex-wrap">
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.keys(GROUPS_2026).map((g) => (
                            <SelectItem key={g} value={g}>Grupo {g}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={resetSimulation} className="gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5" /> Resetar
                </Button>
                <Badge variant="secondary" className="text-xs">
                    ⚠️ Simulação — não altera dados reais
                </Badge>
            </div>

            {isLoading ? (
                <SkeletonCard rows={6} />
            ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Matches */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase">Jogos do Grupo {selectedGroup}</h3>
                        {groupMatches.map((match) => {
                            const hInfo = getTeamInfo(match.home_team);
                            const aInfo = getTeamInfo(match.away_team);
                            return (
                                <motion.div
                                    key={match.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="rounded-xl border border-border bg-card p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <span className="text-lg">{hInfo.flag}</span>
                                            <span className="text-sm font-medium truncate">{match.home_team}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                min="0"
                                                max="20"
                                                className="w-14 h-10 text-center font-bold text-lg"
                                                value={simScores[match.id]?.home ?? (match.home_score ?? "")}
                                                onChange={(e) => updateScore(match.id, "home", e.target.value)}
                                            />
                                            <span className="text-muted-foreground font-bold">×</span>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="20"
                                                className="w-14 h-10 text-center font-bold text-lg"
                                                value={simScores[match.id]?.away ?? (match.away_score ?? "")}
                                                onChange={(e) => updateScore(match.id, "away", e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                                            <span className="text-sm font-medium truncate text-right">{match.away_team}</span>
                                            <span className="text-lg">{aInfo.flag}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Standings */}
                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                            Classificação Simulada — Grupo {selectedGroup}
                        </h3>
                        <div className="rounded-xl border border-border bg-card overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-xs text-muted-foreground uppercase border-b border-border bg-muted/50">
                                        <th className="text-left pl-4 py-2.5">#</th>
                                        <th className="text-left py-2.5">Seleção</th>
                                        <th className="text-center py-2.5">J</th>
                                        <th className="text-center py-2.5">V</th>
                                        <th className="text-center py-2.5">E</th>
                                        <th className="text-center py-2.5">D</th>
                                        <th className="text-center py-2.5">SG</th>
                                        <th className="text-center py-2.5 pr-4 font-bold">Pts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {standings.map((row, i) => {
                                        const info = getTeamInfo(row.team);
                                        return (
                                            <motion.tr
                                                key={row.team}
                                                layout
                                                className={`border-b border-border/50 last:border-0 ${i < 2 ? "bg-primary/5" : ""}`}
                                            >
                                                <td className="pl-4 py-2.5">
                                                    <span className={`text-xs font-bold ${i < 2 ? "text-primary" : "text-muted-foreground"}`}>
                                                        {i + 1}
                                                    </span>
                                                </td>
                                                <td className="py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <span>{info.flag}</span>
                                                        <span className="font-medium text-sm">{row.team}</span>
                                                    </div>
                                                </td>
                                                <td className="text-center tabular-nums">{row.played}</td>
                                                <td className="text-center tabular-nums text-green-500">{row.wins}</td>
                                                <td className="text-center tabular-nums text-yellow-500">{row.draws}</td>
                                                <td className="text-center tabular-nums text-red-500">{row.losses}</td>
                                                <td className="text-center tabular-nums">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                                                <td className="text-center pr-4 font-bold tabular-nums">{row.points}</td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}