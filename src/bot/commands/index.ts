import { PingCommand } from "./ping.command";
import { StartCommand } from "./start.command";
import { TimeCommand } from "./time.command";

export * from './abstract.command'

export const COMMANDS = [
    StartCommand,
    PingCommand,
    TimeCommand
]