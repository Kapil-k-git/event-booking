import { Controller, Get, Param } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("summary")
  async getSummary() {
    return this.analyticsService.getSystemSummary();
  }

  @Get("events/:id")
  async getEventMetrics(@Param("id") id: string) {
    return this.analyticsService.getEventMetrics(id);
  }
}