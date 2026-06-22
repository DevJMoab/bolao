import React from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getTeamInfo, STAGE_LABELS } from "@/lib/copa-data";

export default function MatchCard({ match, onClick, compact = false }) {
    const home = getTeamInfo(match.home_team);
    const away = getTeamInfo(match.away_team);
    const isLive = match.status === "live";
    const isFinished = match.status === "finished";

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            onClick={onClick}
            className={`rounded-xl border bg-card p-4 cursor-pointer transition-all hover:shadow-lg hover:border-primary/30 ${isLive ? "border-primary/50 ring-1 ring-primary/20" : "border-border"
                }`}
        >
            {/* Top row */}
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground font-medium">
                    {STAGE_LABELS[match.stage] || match.stage}
                    {match.group_name && ` · Grupo ${match.group_name}`}
                </span>
                {isLive && (
                    <Badge className="bg-red-500/10 text-red-500 border-red-500/20 gap-1 animate-pulse">
                        <Radio className="w-3 h-3" />
                        AO VIVO {match.minute && `· ${match.minute}'`}
                    </Badge>
                )}
                {isFinished && (
                    <Badge variant="secondary" className="gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Encerrado
                    </Badge>
                )}
                {!isLive && !isFinished && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {match.kickoff_at ? format(new Date(match.kickoff_at), "dd/MM HH:mm", { locale: ptBR }) : "A definir"}
                    </div>
                )}
            </div>

            {/* Teams */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="text-2xl">{home.flag}</span>
                    <span className={`font-semibold text-sm truncate ${!compact ? "md:text-base" : ""}`}>
                        {match.home_team}
                    </span>
                </div>

                <div className="flex items-center gap-2 px-4">
                    {(isLive || isFinished) ? (
                        <>
                            <span className={`text-2xl font-bold tabular-nums ${isLive ? "text-primary" : ""}`}>
                                {match.home_score ?? "-"}
                            </span>
                            <span className="text-muted-foreground text-lg">×</span>
                            <span className={`text-2xl font-bold tabular-nums ${isLive ? "text-primary" : ""}`}>
                                {match.away_score ?? "-"}
                            </span>
                        </>
                    ) : (
                        <span className="text-lg font-bold text-muted-foreground">VS</span>
                    )}
                </div>

                <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
                    <span className={`font-semibold text-sm truncate text-right ${!compact ? "md:text-base" : ""}`}>
                        {match.away_team}
                    </span>
                    <span className="text-2xl">{away.flag}</span>
                </div>
            </div>

            {/* Venue */}
            {match.venue && !compact && (
                <p className="text-xs text-muted-foreground mt-3 text-center">{match.venue}</p>
            )}
        </motion.div>
    );
}