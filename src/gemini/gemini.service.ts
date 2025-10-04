import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private model: GenerativeModel;

  constructor(configService: ConfigService) {
    const apiKey = configService.get('GEMINI_API_KEY');
    const genAI = new GoogleGenerativeAI(apiKey);

    this.model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
    });
  }

  public async generate(prompt: string): Promise<string> {
      const res = await this.model.generateContent(prompt);
      const text = res.response.text();
      return text;
  }
}
