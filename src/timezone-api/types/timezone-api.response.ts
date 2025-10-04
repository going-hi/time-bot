export type TimezoneApiResponseType = {
  utc_offset: string; // "+02:00"
  timezone: string; // "Europe/Kaliningrad"
  day_of_week: number; // 6
  day_of_year: number; // 277
  datetime: string; // "2025-10-04T03:02:59.713509+02:00"
  utc_datetime: string; // "2025-10-04T01:02:59.713509+00:00"
  unixtime: string; // "1696398179"
  raw_offset: number; // 7200
  week_number: number; // 40
  dst: boolean; // true
  abbreviation: string;
  dst_offset: number; // 3600
  dst_from: string; // "2025-03-30T01:00:00+00:00"
  dst_until: string; // "2025-10-26T01:00:00+00:00"
  client_ip: string; // "45.10.42.157"
};
