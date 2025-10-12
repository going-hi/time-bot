import { AbstractCommand } from './abstract.command'
import { ContextBotType } from '../types'

export class AddImageCommand extends AbstractCommand {
	public commandName = 'addimage'
	public commandDescription = ''

	public isMenuCommand = false
	public isPhoto = true

	async execute(ctx: ContextBotType): Promise<void> {
		console.log(ctx, ctx.message?.entities, 'GUI PHOTO')

		// if (!ctx.config.isDeveloper) {
		// 	return
		// }

		const photos = Array.isArray(ctx.message?.photo) ? ctx.message.photo : []

		if (!photos.length) {
			await ctx.reply('Загрузите фотографию!')
			return
		}

		const { file_id } = photos[0]

		const images = await this.imageCommonRepository.getImages()



		if (images.includes(file_id)) {
			await ctx.reply('Такая фотография уже добавлена')
			return
		}

		images.push(file_id)


		console.log("saves: ", images)
		await this.imageCommonRepository.saveImages(images)
		await ctx.reply('Вы успешно сохранили фотографию!')
	}
}
