import { createValorantApiClient } from "@tqman/valorant-api-client";
import { presets } from "@tqman/valorant-api-client/presets";

export async function createClient() {
    return await createValorantApiClient(presets.local);
}

export async function connectToValorant() {
    console.log("Connecting to Valorant...");
    try {
        const client = await createClient();
        console.log("Connected!");
        return client;
    } catch (error) {
        console.error("Failed to connect. Is Valorant running?");
        process.exit(1);
    }
}
