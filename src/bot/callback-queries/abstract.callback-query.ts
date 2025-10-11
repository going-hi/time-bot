import { ContextBotType } from "../types";

export abstract class AbstractCallbackQuery {
    public name: string

    abstract execute(ctx: ContextBotType): Promise<void>
}