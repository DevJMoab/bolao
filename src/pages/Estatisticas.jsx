import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import PageHeader from "@/components/ui/PageHeader";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { getTeamInfo } from "@/lib/copa-data";

const CHART_COLORS = ["hsl(152,68%,45%)", "hsl(44,92%,55%)", "hsl(200,70%,55%)", "hsl(280,60%,55%)", "hsl(340,75%,55%)", "hsl(30,80%,50%)", "hsl(170,60%,40%)", "hsl(0,70%,55%)"];

export default function Estatisticas() {
    const { data: matches = [], isLoading } = useQuery({
        queryKey: ["matches-stats"],
        queryFn: () => base44.entities.Match.list("-kickoff_at", 200),
    });

    const finishedMatches = useMemo(() => matches.filter((m) => m.status === "finished"), [matches]);

    const stats = useMemo(() => {
        const totalGoals = finishedMatches.reduce((s, m) => s + (m.home_score || 0) + (m.away_score || 0), 0);
        const avgGoals = finishedMatches.length > 0 ? (totalGoals / finishedMatches.length).toFixed(1) : 0;
        const homeWins = finishedMatches.filter((m) => m.home_score > m.away_score).length;
        const awayWins = finishedMatches.filter((m) => m.away_score > m.home_score).length;
        const draws = finishedMatches.filter((m) => m.home_score === m.away_score).length;

        // Goals by team
        const teamGoals = {};
        finishedMatches.forEach((m) => {
            teamGoals[m.home_team] = (teamGoals[m.home_team] || 0) + (m.home_score || 0);
            teamGoals[m.away_team] = (teamGoals[m.away_team] || 0) + (m.away_score || 0);
        });
        const topScoring = Object.entries(teamGoals)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8)
            .map(([team, goals]) => ({ team, goals, flag: getTeamInfo(team).flag }));

        // Goals by stage
        const stageGoals = {};
        finishedMatches.forEach((m) => {
            const stage = m.stage || "group";
            stageGoals[stage] = (stageGoals[stage] || 0) + (m.home_score || 0) + (m.away_score || 0);
        });
        const goalsByStage = Object.entries(stageGoals).map(([stage, goals]) => ({ stage, goals }));

        const resultDist = [
            { name: "Mandante", value: homeWins, color: CHART_COLORS[0] },
            { name: "Visitante", value: awayWins, color: CHART_COLORS[1] },
            { name: "Empate", value: draws, color: CHART_COLORS[2] },
        ].filter((d) => d.value > 0);

        return { totalGoals, avgGoals, homeWins, awayWins, draws, topScoring, goalsByStage, resultDist, totalMatches: finishedMatches.length };
    }, [finishedMatches]);

    return (
        <div className="space-y-6">
            <PageHeader icon={BarChart3} title="Estatísticas" subtitle="Números e tendências da Copa" />

            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} rows={1} />)}
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: "Jogos Encerrados", value: stats.totalMatches },
                            { label: "Total de Gols", value: stats.totalGoals },
                            { label: "Média de Gols", value: stats.avgGoals },
                            { label: "Maior Placar", value: finishedMatches.length > 0 ? Math.max(...finishedMatches.map((m) => (m.home_score || 0) + (m.away_score || 0))) : 0 },
                        ].map((item, i) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card>
                                    <CardContent className="p-4">
                                        <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
                                        <p className="text-2xl font-display font-bold mt-1">{item.value}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Top Scoring Teams */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-display">Seleções com mais gols</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {stats.topScoring.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={stats.topScoring} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                            <XAxis type="number" tick={{ fontSize: 12 }} />
                                            <YAxis type="category" dataKey="team" width={90} tick={{ fontSize: 11 }} />
                                            <Tooltip
                                                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                                            />
                                            <Bar dataKey="goals" fill="hsl(152,68%,45%)" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-8">Sem dados ainda</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Result Distribution */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-display">Distribuição de Resultados</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {stats.resultDist.some((d) => d.value > 0) ? (
                                    <div className="flex items-center justify-center">
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie
                                                    data={stats.resultDist}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={90}
                                                    paddingAngle={4}
                                                    dataKey="value"
                                                    label={({ name, value }) => `${name}: ${value}`}
                                                >
                                                    {stats.resultDist.map((entry, i) => (
                                                        <Cell key={i} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-8">Sem dados ainda</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}