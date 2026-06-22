import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/ui/PageHeader";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { GROUPS_2026, getTeamInfo } from "@/lib/copa-data";

function buildGroupStandings(matches, groupTeams) {
    const standings = {};
    groupTeams.forEach((team) => {
        standings[team] = { team, played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, points: 0 };
    });

    matches.forEach((m) => {
        if (m.status !== "finished" || m.home_score == null) return;
        const h = standings[m.home_team];
        const a = standings[m.away_team];
        if (!h || !a) return;
        h.played++; a.played++;
        h.gf += m.home_score; h.ga += m.away_score;
        a.gf += m.away_score; a.ga += m.home_score;
        h.gd = h.gf - h.ga; a.gd = a.gf - a.ga;
        if (m.home_score > m.away_score) { h.wins++; h.points += 3; a.losses++; }
        else if (m.home_score < m.away_score) { a.wins++; a.points += 3; h.losses++; }
        else { h.draws++; h.points += 1; a.draws++; a.points += 1; }
    });

    return Object.values(standings).sort((a, b) =>
        b.points - a.points || b.gd - a.gd || b.gf - a.gf || a.team.localeCompare(b.team)
    );
}

function GroupTable({ group, teams, matches }) {
    const standings = useMemo(() => {
        const groupMatches = matches.filter((m) => m.group_name === group && m.stage === "group");
        return buildGroupStandings(groupMatches, teams);
    }, [matches, group, teams]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card overflow-hidden"
        >
            <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-2">
                <Badge variant="outline" className="font-display font-bold">
                    Grupo {group}
                </Badge>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-xs text-muted-foreground uppercase border-b border-border">
                            <th className="text-left pl-4 py-2.5 w-8">#</th>
                            <th className="text-left py-2.5">Seleção</th>
                            <th className="text-center py-2.5 w-8">J</th>
                            <th className="text-center py-2.5 w-8">V</th>
                            <th className="text-center py-2.5 w-8">E</th>
                            <th className="text-center py-2.5 w-8">D</th>
                            <th className="text-center py-2.5 w-10">SG</th>
                            <th className="text-center py-2.5 w-10 pr-4 font-bold">Pts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {standings.map((row, i) => {
                            const info = getTeamInfo(row.team);
                            const qualified = i < 2;
                            return (
                                <tr
                                    key={row.team}
                                    className={`border-b border-border/50 last:border-0 transition-colors ${qualified ? "bg-primary/5" : ""
                                        }`}
                                >
                                    <td className="pl-4 py-2.5">
                                        <span className={`text-xs font-bold ${qualified ? "text-primary" : "text-muted-foreground"}`}>
                                            {i + 1}
                                        </span>
                                    </td>
                                    <td className="py-2.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{info.flag}</span>
                                            <span className="font-medium text-sm">{row.team}</span>
                                        </div>
                                    </td>
                                    <td className="text-center py-2.5 tabular-nums">{row.played}</td>
                                    <td className="text-center py-2.5 tabular-nums text-green-500">{row.wins}</td>
                                    <td className="text-center py-2.5 tabular-nums text-yellow-500">{row.draws}</td>
                                    <td className="text-center py-2.5 tabular-nums text-red-500">{row.losses}</td>
                                    <td className="text-center py-2.5 tabular-nums">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                                    <td className="text-center py-2.5 pr-4 font-bold tabular-nums">{row.points}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}

export default function Tabela() {
    const [selectedGroup, setSelectedGroup] = useState("all");

    const { data: matches = [], isLoading } = useQuery({
        queryKey: ["matches-tabela"],
        queryFn: () => base44.entities.Match.filter({ stage: "group" }),
    });

    const groups = Object.keys(GROUPS_2026);

    return (
        <div className="space-y-6">
            <PageHeader icon={Trophy} title="Tabela da Copa" subtitle="Classificação por grupo" />

            <div className="overflow-x-auto -mx-4 px-4">
                <Tabs value={selectedGroup} onValueChange={setSelectedGroup}>
                    <TabsList className="inline-flex w-auto">
                        <TabsTrigger value="all">Todos</TabsTrigger>
                        {groups.map((g) => (
                            <TabsTrigger key={g} value={g}>{g}</TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} rows={5} />)}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {groups
                        .filter((g) => selectedGroup === "all" || selectedGroup === g)
                        .map((g) => (
                            <GroupTable key={g} group={g} teams={GROUPS_2026[g]} matches={matches} />
                        ))}
                </div>
            )}
        </div>
    );
}