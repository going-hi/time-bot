import { Module } from "@nestjs/common";
import { TimezoneApiService } from "./timezone-api.service";

@Module({
    providers: [TimezoneApiService],
    exports: [TimezoneApiService]
})
export class TimezoneApiModule {}