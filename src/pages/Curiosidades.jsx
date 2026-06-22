import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Crown, Award, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PageHeader from "@/components/ui/PageHeader";
import { WORLD_CUP_HISTORY, ALL_TIME_TOP_SCORERS, TITLES_COUNT, getTeamInfo, TEAMS } from "@/lib/copa-data";

function FifaRanking() {
    const ranked = Object.entries(TEAMS)
        .sort(([, a], [, b]) => a.fifa_rank - b.fifa_rank)
        .slice(0, 20);

    return (
        <div className="space-y-2">
            {ranked.map(([name, info], i) => (
                <motion.div
                    key={name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-card border border-border"
                >
                    <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                            }`}>
                            {info.fifa_rank}
                        </span>
                        <span className="text-lg">{info.flag}</span>
                        <span className="font-medium text-sm">{name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">{info.confederation}</Badge>
                </motion.div>
            ))}
        </div>
    );
}

function HistoryTable() {
    return (
        <div className="space-y-2">
            {WORLD_CUP_HISTORY.map((cup, i) => (
                <motion.div
                    key={cup.year}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-card border border-border"
                >
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-display font-bold text-sm">{cup.year}</Badge>
                        <div>
                            <p className="text-sm font-medium flex items-center gap-1.5">
                                <Crown className="w-3.5 h-3.5 text-secondary" />
                                {getTeamInfo(cup.champion).flag} {cup.champion}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <Award className="w-3 h-3" />
                                {getTeamInfo(cup.runnerUp).flag} {cup.runnerUp}
                            </p>
                        </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{cup.host}</span>
                </motion.div>
            ))}
        </div>
    );
}

function TopScorers() {
    return (
        <div className="space-y-2">
            {ALL_TIME_TOP_SCORERS.map((player, i) => (
                <motion.div
                    key={player.player}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-card border border-border"
                >
                    <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"
                            }`}>
                            {i + 1}
                        </span>
                        <div>
                            <p className="text-sm font-medium">{player.player}</p>
                            <p className="text-xs text-muted-foreground">
                                {getTeamInfo(player.country).flag} {player.country} · {player.cups}
                            </p>
                        </div>
                    </div>
                    <span className="text-lg font-display font-bold text-primary">{player.goals} ⚽</span>
                </motion.div>
            ))}
        </div>
    );
}

function TitlesRanking() {
    const sorted = Object.entries(TITLES_COUNT).sort(([, a], [, b]) => b - a);
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {sorted.map(([team, titles], i) => (
                <motion.div
                    key={team}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                >
                    <Card className={`text-center ${i === 0 ? "border-secondary/30 bg-secondary/5" : ""}`}>
                        <CardContent className="p-4">
                            <span className="text-3xl">{getTeamInfo(team).flag}</span>
                            <p className="font-medium text-sm mt-2">{team}</p>
                            <p className="text-2xl font-display font-bold text-primary mt-1">{titles}×</p>
                            <p className="text-xs text-muted-foreground">
                                {titles === 1 ? "título" : "títulos"}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}

export default function Curiosidades() {
    return (
        <div className="space-y-6">
            <PageHeader icon={BookOpen} title="Curiosidades" subtitle="Histórico, rankings e recordes" />

            <Tabs defaultValue="history">
                <TabsList className="w-full grid grid-cols-4">
                    <TabsTrigger value="history">Campeões</TabsTrigger>
                    <TabsTrigger value="scorers">Artilheiros</TabsTrigger>
                    <TabsTrigger value="titles">Títulos</TabsTrigger>
                    <TabsTrigger value="ranking">Ranking</TabsTrigger>
                </TabsList>

                <TabsContent value="history" className="mt-4">
                    <HistoryTable />
                </TabsContent>
                <TabsContent value="scorers" className="mt-4">
                    <TopScorers />
                </TabsContent>
                <TabsContent value="titles" className="mt-4">
                    <TitlesRanking />
                </TabsContent>
                <TabsContent value="ranking" className="mt-4">
                    <FifaRanking />
                </TabsContent>
            </Tabs>
        </div>
    );
}