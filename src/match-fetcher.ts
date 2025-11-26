import { ValorantApiClient } from "@tqman/valorant-api-client";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import ora from "ora";

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

        const spinner = ora(`[GAME END] Fetching match data for ${matchId}...`).start();

        // リトライ処理（長い試合はサーバー処理に時間がかかる）
        const maxRetries = 5;
        const delays = [5000, 10000, 15000, 20000, 30000]; // 5秒, 10秒, 15秒, 20秒, 30秒

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            await new Promise(resolve => setTimeout(resolve, delays[attempt]));

            spinner.text = `[ATTEMPT ${attempt + 1}/${maxRetries}] Fetching match data...`;

            try {
                const { data } = await this.client.remote.getMatchDetails({
                    data: { matchId }
                });

                const fileName = `${matchId}.json`;
                mkdirSync("output", { recursive: true });
                writeFileSync(join("output", fileName), JSON.stringify(data, null, 2));

                spinner.succeed(`[SUCCESS] Match data saved to output/${fileName} (Retrieved on attempt ${attempt + 1}/${maxRetries})`);
                return; // 成功したら終了
            } catch (e: any) {
                if (e.response) {
                    const status = e.response.status;

                    if (status === 400) {
                        if (attempt < maxRetries - 1) {
                            spinner.text = `⏳ Match data not ready yet. Retrying in ${delays[attempt + 1] / 1000}s...`;
                        } else {
                            spinner.fail(`Failed to fetch match after ${maxRetries} attempts.`);
                            console.error("\nPossible reasons:");
                            console.error("  - Custom game with 'Do not record match history' setting");
                            console.error("  - Match data may take longer to process (try again later)");
                        }
                    } else if (status === 403) {
                        spinner.fail(`Access denied (403).`);
                        console.error(`  - Please run as a player, not as a coach.`);
                        return; // 403はリトライしても無駄なので終了
                    } else {
                        spinner.fail(`Unexpected error: ${status}`);
                    }
                } else {
                    spinner.fail(`Network error: ${e.message}`);
                }
            }
        }
    }
}
