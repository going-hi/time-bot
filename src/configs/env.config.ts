import { envValidate } from '@/core/utils'
import { ConfigModuleOptions } from '@nestjs/config'
import { IsString } from 'class-validator'

interface EnvironmentVariablesInterface {
    BOT_TOKEN: string
    GEMINI_API_KEY: string
    SQLITE_PATH: string
}

export class EnvironmentVariables implements EnvironmentVariablesInterface {
    @IsString()
    BOT_TOKEN: string

    @IsString()
    GEMINI_API_KEY: string

    @IsString()
    SQLITE_PATH: string;
}

export const EnvConfigOptions: ConfigModuleOptions = {
	validate: envValidate(EnvironmentVariables),
	isGlobal: true,
}