import { ValorantApiClient } from "@tqman/valorant-api-client";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

export class MatchFetcher {
    private lastMatchId: string | null = null;

    constructor(private client: ValorantApiClient) { }

    async onInGame(matchId?: string) {
        if (matchId) {
            this.lastMatchId = matchId;
            console.log(`[INGAME] Using provided Match ID: ${this.lastMatchId}`);
            return;
        }

        try {
            const { data } = await this.client.remote.getCurrentGamePlayer({
                data: { puuid: this.client.remote.puuid }
            });
            this.lastMatchId = data.MatchID;
            console.log(`[INGAME] Captured Match ID from API: ${this.lastMatchId}`);
        } catch (e) {
            console.error("Failed to get current match ID from API", e);
        }
    }

    async onGameEnd() {
        if (!this.lastMatchId) {
            console.log("No match ID to fetch.");
            return;
        }

        const matchId = this.lastMatchId;
        this.lastMatchId = null; // Reset

        console.log(`[GAME END] Waiting 5 seconds before fetching match ${matchId}...`);

        setTimeout(async () => {
            try {
                // Debug: Log available methods on remote
                console.log("Available remote methods:", Object.keys(Object.getPrototypeOf(this.client.remote)));

                const { data } = await this.client.remote.getMatchDetails({
                    data: { matchId }
                });

                const fileName = `${matchId}.json`;
                mkdirSync("output", { recursive: true });
                writeFileSync(join("output", fileName), JSON.stringify(data, null, 2));

                console.log(`[SUCCESS] Match data saved to output/${fileName}`);
            } catch (e) {
                console.error("Failed to fetch match details", e);
            }
        }, 5000);
    }
}
