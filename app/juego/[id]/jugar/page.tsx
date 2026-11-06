import { Suspense } from "react";
import { notFound } from "next/navigation";
import { GAMES, getGame } from "@/lib/games";
import { GamePlayer } from "@/components/game-player";

export function generateStaticParams() {
  return GAMES.map((g) => ({ id: g.id }));
}

type Params = Promise<{ id: string }>;

// `params` is only read inside <Suspense> so the route has an instant static shell.
export default function PlayerPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div className="spinner" aria-label="Cargando" />}>
      <Player params={params} />
    </Suspense>
  );
}

async function Player({ params }: { params: Params }) {
  const { id } = await params;
  const game = getGame(id);
  if (!game) notFound();

  return <GamePlayer game={game} />;
}
