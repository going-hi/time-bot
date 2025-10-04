import { Injectable } from '@nestjs/common';
import { TimezoneApiResponseType } from './types';
import axios from 'axios';

@Injectable()
export class TimezoneApiService {
  private url = 'http://worldtimeapi.org/api/timezone';

  public async getDataByTimezone(
    timezone: string,
  ): Promise<TimezoneApiResponseType> {
    try {
      const [part, last] = timezone.split('/');

      const link = `${this.url}/${part}/${last}`;

      const res = await axios.get<TimezoneApiResponseType>(link);
      return res.data;
    } catch (error) {
      throw new Error('Invalid timezone');
    }
  }
}
