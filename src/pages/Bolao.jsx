import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { motion } from "framer-motion";
import { Target, Lock, Trophy, Save, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import PageHeader from "@/components/ui/PageHeader";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { getTeamInfo, isMatchLocked, isChampionPredictionLocked, ALL_TEAMS_LIST } from "@/lib/copa-data";

function PredictionCard({ match, prediction, onSave }) {
    const [homeScore, setHomeScore] = useState(prediction?.home_score_pred ?? "");
    const [awayScore, setAwayScore] = useState(prediction?.away_score_pred ?? "");
    const locked = isMatchLocked(match.kickoff_at) || match.status !== "scheduled";
    const hInfo = getTeamInfo(match.home_team);
    const aInfo = getTeamInfo(match.away_team);
    const points = prediction?.points_earned;

    const handleSave = () => {
        if (homeScore === "" || awayScore === "") return;
        onSave(match.id, parseInt(homeScore), parseInt(awayScore), prediction?.id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border bg-card p-4 ${locked ? "opacity-70" : "border-border"}`}
        >
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">
                    {match.group_name ? `Grupo ${match.group_name}` : match.stage}
                </span>
                {locked && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                        <Lock className="w-3 h-3" /> Bloqueado
                    </Badge>
                )}
                {points != null && points > 0 && (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                        +{points} pts
                    </Badge>
                )}
            </div>
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
                        className="w-12 h-9 text-center font-bold"
                        value={homeScore}
                        onChange={(e) => setHomeScore(e.target.value)}
                        readOnly={locked}
                    />
                    <span className="text-muted-foreground text-sm">×</span>
                    <Input
                        type="number"
                        min="0"
                        max="20"
                        className="w-12 h-9 text-center font-bold"
                        value={awayScore}
                        onChange={(e) => setAwayScore(e.target.value)}
                        readOnly={locked}
                    />
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                    <span className="text-sm font-medium truncate text-right">{match.away_team}</span>
                    <span className="text-lg">{aInfo.flag}</span>
                </div>
            </div>
            {!locked && (
                <div className="flex justify-end mt-3">
                    <Button size="sm" onClick={handleSave} className="gap-1.5">
                        <Save className="w-3.5 h-3.5" /> Salvar
                    </Button>
                </div>
            )}
            {match.status === "finished" && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                    Resultado: {match.home_score} × {match.away_score}
                </p>
            )}
        </motion.div>
    );
}

export default function Bolao() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: matches = [], isLoading: loadingMatches } = useQuery({
        queryKey: ["matches-bolao"],
        queryFn: () => base44.entities.Match.list("kickoff_at", 200),
    });

    const { data: predictions = [], isLoading: loadingPreds } = useQuery({
        queryKey: ["my-predictions"],
        queryFn: () => base44.entities.Prediction.filter({ created_by_id: user?.id }),
        enabled: !!user?.id,
    });

    const { data: tournamentPred } = useQuery({
        queryKey: ["my-tournament-pred"],
        queryFn: async () => {
            const list = await base44.entities.TournamentPrediction.filter({ created_by_id: user?.id });
            return list[0] || null;
        },
        enabled: !!user?.id,
    });

    const { data: standings = [] } = useQuery({
        queryKey: ["standings"],
        queryFn: () => base44.entities.Standing.list("-total_points", 50),
    });

    const predMap = useMemo(() => {
        const map = {};
        predictions.forEach((p) => { map[p.match_id] = p; });
        return map;
    }, [predictions]);

    const savePredMutation = useMutation({
        mutationFn: async ({ matchId, homePred, awayPred, existingId }) => {
            const data = { match_id: matchId, home_score_pred: homePred, away_score_pred: awayPred };
            if (existingId) {
                return base44.entities.Prediction.update(existingId, data);
            }
            return base44.entities.Prediction.create(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-predictions"] });
            toast({ title: "Palpite salvo!", description: "Seu palpite foi registrado com sucesso." });
        },
    });

    const [champion, setChampion] = useState(tournamentPred?.champion_team || "");
    const [runnerUp, setRunnerUp] = useState(tournamentPred?.runner_up_team || "");
    const champLocked = isChampionPredictionLocked();

    useEffect(() => {
        if (tournamentPred) {
            setChampion(tournamentPred.champion_team || "");
            setRunnerUp(tournamentPred.runner_up_team || "");
        }
    }, [tournamentPred]);

    const saveChampionMutation = useMutation({
        mutationFn: async () => {
            const data = { champion_team: champion, runner_up_team: runnerUp };
            if (tournamentPred?.id) {
                return base44.entities.TournamentPrediction.update(tournamentPred.id, data);
            }
            return base44.entities.TournamentPrediction.create(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-tournament-pred"] });
            toast({ title: "Palpite de campeão salvo!" });
        },
    });

    const totalPoints = useMemo(() => {
        return predictions.reduce((s, p) => s + (p.points_earned || 0), 0)
            + (tournamentPred?.champion_points || 0)
            + (tournamentPred?.runner_up_points || 0);
    }, [predictions, tournamentPred]);

    const isLoading = loadingMatches || loadingPreds;

    return (
        <div className="space-y-6">
            <PageHeader icon={Target} title="Bolão" subtitle="Faça seus palpites e dispute com amigos" />

            {/* Points Summary */}
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Sua pontuação total</p>
                        <p className="text-3xl font-display font-bold text-primary">{totalPoints} pts</p>
                    </div>
                    <Trophy className="w-10 h-10 text-secondary opacity-60" />
                </CardContent>
            </Card>

            <Tabs defaultValue="predictions">
                <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="predictions">Palpites</TabsTrigger>
                    <TabsTrigger value="champion">Campeão</TabsTrigger>
                    <TabsTrigger value="ranking">Ranking</TabsTrigger>
                </TabsList>

                <TabsContent value="predictions" className="space-y-3 mt-4">
                    {isLoading ? (
                        [1, 2, 3].map((i) => <SkeletonCard key={i} rows={2} />)
                    ) : matches.length > 0 ? (
                        matches.map((match) => (
                            <PredictionCard
                                key={match.id}
                                match={match}
                                prediction={predMap[match.id]}
                                onSave={(matchId, h, a, existingId) =>
                                    savePredMutation.mutate({ matchId, homePred: h, awayPred: a, existingId })
                                }
                            />
                        ))
                    ) : (
                        <Card className="p-8 text-center text-muted-foreground">
                            <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Nenhum jogo disponível para palpite ainda</p>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="champion" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-display flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-secondary" />
                                Palpite de Campeão e Vice
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                                Prazo: até 28/06/2025 23:59 (horário de Brasília)
                                {champLocked && (
                                    <Badge variant="secondary" className="ml-2 gap-1 text-xs">
                                        <Lock className="w-3 h-3" /> Bloqueado
                                    </Badge>
                                )}
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">🏆 Campeão (10 pts)</label>
                                <Select value={champion} onValueChange={setChampion} disabled={champLocked}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o campeão" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ALL_TEAMS_LIST.map((t) => (
                                            <SelectItem key={t} value={t}>
                                                {getTeamInfo(t).flag} {t}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">🥈 Vice-campeão (5 pts)</label>
                                <Select value={runnerUp} onValueChange={setRunnerUp} disabled={champLocked}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o vice" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ALL_TEAMS_LIST.filter((t) => t !== champion).map((t) => (
                                            <SelectItem key={t} value={t}>
                                                {getTeamInfo(t).flag} {t}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {!champLocked && (
                                <Button onClick={() => saveChampionMutation.mutate()} disabled={!champion || !runnerUp} className="w-full gap-1.5">
                                    <Save className="w-4 h-4" /> Salvar Palpite
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ranking" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-display flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                Ranking Geral
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {standings.length > 0 ? (
                                <div className="space-y-2">
                                    {standings.map((s, i) => (
                                        <div
                                            key={s.id}
                                            className={`flex items-center justify-between p-3 rounded-lg ${i === 0 ? "bg-secondary/10 border border-secondary/30" :
                                                    i === 1 ? "bg-muted/80" :
                                                        i === 2 ? "bg-orange-500/5" : "bg-card"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? "bg-secondary text-secondary-foreground" :
                                                        i === 1 ? "bg-muted-foreground/20 text-foreground" :
                                                            i === 2 ? "bg-orange-500/20 text-orange-600" : "bg-muted text-muted-foreground"
                                                    }`}>
                                                    {i + 1}
                                                </span>
                                                <div>
                                                    <p className="text-sm font-medium">{s.user_name || "Participante"}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {s.exact_scores || 0} exatos · {s.correct_outcomes || 0} acertos
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-lg font-display font-bold text-primary">{s.total_points} pts</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-sm text-muted-foreground py-8">
                                    Nenhum participante no ranking ainda
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}