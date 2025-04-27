import { Controller, Get } from "@nestjs/common";
import { ReportService } from "./report.service";

@Controller("report")
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Get()
    async getReport() {
        // Call the report service to get the report data
        const reportData = await this.reportService.generateReport();
        
        // Return the report data
        return reportData;
    }
}