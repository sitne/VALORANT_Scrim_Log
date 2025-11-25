import { connectToValorant } from "./connection";
import { GameStateMonitor } from "./game-state";
import { MatchFetcher } from "./match-fetcher";

async function main() {
    const client = await connectToValorant();
    const monitor = new GameStateMonitor(client);
    const fetcher = new MatchFetcher(client);

    console.log("Monitoring game state...");

    monitor.state$.subscribe(async data => {
        console.log(`State changed to: ${data.state}`);

        if (data.state === "INGAME") {
            await fetcher.onInGame(data.matchId);
        } else if (data.state === "MENUS") {
            // If we transitioned TO menus, check if we need to fetch a match
            await fetcher.onGameEnd();
        }
    });

    monitor.start();
}

main();
