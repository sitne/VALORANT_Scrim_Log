import { ValorantApiClient } from "@tqman/valorant-api-client";
import { Subject, timer, switchMap, distinctUntilChanged } from "rxjs";
import ora from "ora"; // 追加

export type GameState = "MENUS" | "PREGAME" | "INGAME";
export type GameStateData = { state: GameState; matchId?: string };

export class GameStateMonitor {
    state$ = new Subject<GameStateData>();

    constructor(private client: ValorantApiClient) { }

    start() {
        // ループの外でスピナーを初期化・開始
        const spinner = ora('Initializing monitor...').start();

        timer(0, 1000)
            .pipe(
                switchMap(async (): Promise<GameStateData> => {
                    try {
                        const { data: { presences } } = await this.client.local.getPresence();
                        const myPresence = presences.find(p => p.puuid === this.client.remote.puuid);

                        if (!myPresence) {
                            // console.logの代わりにspinnerのテキストを更新
                            spinner.text = "My presence not found";
                            return { state: "MENUS" };
                        }

                        const privateData = JSON.parse(Buffer.from(myPresence.private, "base64").toString());

                        let loopState = privateData.sessionLoopState;
                        let matchId: string | undefined;

                        if (!loopState && privateData.matchPresenceData) {
                            loopState = privateData.matchPresenceData.sessionLoopState;
                            matchId = privateData.matchPresenceData.matchId;
                        }

                        if (!loopState) {
                            loopState = privateData.partyOwnerSessionLoopState;
                        }

                        if (!loopState && privateData.partyPresenceData) {
                            loopState = privateData.partyPresenceData.partyOwnerSessionLoopState;
                            matchId = privateData.partyPresenceData.matchId;
                        }

                        if (!matchId && privateData.matchId) {
                            matchId = privateData.matchId;
                        }

                        // 【修正箇所】ここを console.log から spinner.text への代入に変更
                        spinner.text = `Resolved Loop State: ${loopState}, Match ID: ${matchId || 'None'}`;

                        return {
                            state: (loopState as GameState) || "MENUS",
                            matchId
                        };
                    } catch (e) {
                        spinner.text = "Error polling presence";
                        return { state: "MENUS" };
                    }
                }),
                distinctUntilChanged((prev, curr) => prev.state === curr.state && prev.matchId === curr.matchId)
            )
            .subscribe(data => {
                this.state$.next(data);
            });
    }
}