import { AbstractCommand } from './abstract.command'
import { ContextBotType } from '../types'

export const images: string[] = []

export class AddImageCommand extends AbstractCommand {
	public commandName = 'addimage'
	public commandDescription = ''

	public isMenuCommand = false
	public isPhoto = true

	async execute(ctx: ContextBotType): Promise<void> {
		console.log(ctx, ctx.message?.entities, 'GUI PHOTO')

		const photos = Array.isArray(ctx.message?.photo) ? ctx.message.photo : []

		if (!photos.length) {
			await ctx.reply('Загрузите фотографию!')
			return
		}

		const { file_id } = photos[0]

        if(images.includes(file_id)) {
            await ctx.reply("Такая фотография уже добавлена")
        }
        images.push(file_id)
        await ctx.reply("Вы успешно сохранили фотографию!")
	}
}
