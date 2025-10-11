import { AddImageCommand } from './add-image.command'
import { DelCityCommand } from './del-city.command'
import { PingCommand } from './ping.command'
import { SetCityCommand } from './set-city.command'
import { SetNotificationCommand } from './set-notification.command'
import { StartCommand } from './start.command'
import { TimeCommand } from './time.command'

export * from './abstract.command'

export const COMMANDS = [
	StartCommand,
	PingCommand,
	TimeCommand,
	SetCityCommand,
	DelCityCommand,
	SetNotificationCommand,
	AddImageCommand
]
