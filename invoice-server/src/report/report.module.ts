import { Module } from "@nestjs/common";
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";
import { MongooseModule } from "@nestjs/mongoose";
import appDb from "src/app.db";

@Module({
    imports: [MongooseModule.forFeature(appDb)],
    controllers: [ReportController],
    providers: [ReportService],
}) 
export class ReportModule {}