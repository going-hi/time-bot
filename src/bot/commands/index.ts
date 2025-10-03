import { PingCommand } from "./ping.command";
import { StartCommand } from "./start.command";

export * from './abstract.command'

export const COMMANDS = [
    StartCommand,
    PingCommand
]