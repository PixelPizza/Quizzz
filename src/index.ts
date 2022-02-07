import "@sapphire/plugin-logger/register";
import "./container";
import { config } from "dotenv";
import parseEnv from "dotenv-parse-variables";
import { SapphireClient, ApplicationCommandRegistries, RegisterBehavior, LogLevel } from "@sapphire/framework";
process.env = parseEnv(config().parsed!) as NodeJS.ProcessEnv;

async function main() {
    const client = new SapphireClient({
        intents: ["GUILDS", "GUILD_MESSAGES"],
        logger: {
            level: LogLevel.Debug
        }
    });
    
    ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);
    
    await client.login(process.env.TOKEN);
}

void main();