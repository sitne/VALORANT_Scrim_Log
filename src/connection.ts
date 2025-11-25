import { createValorantApiClient } from "@tqman/valorant-api-client";
import { presets } from "@tqman/valorant-api-client/presets";

export async function connectToValorant() {
    console.log("Connecting to Valorant...");
    try {
        const client = await createValorantApiClient(presets.local);
        console.log("Connected!");
        return client;
    } catch (error) {
        console.error("Failed to connect. Is Valorant running?");
        process.exit(1);
    }
}
