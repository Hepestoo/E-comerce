import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('dashboard')
// 👇 PON ESTAS DOS BARRAS AQUÍ PARA COMENTAR LA LÍNEA
// @UseGuards(AuthGuard('jwt'))  <--- ESTO ES LO QUE TE DA EL ERROR 401
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('orders')
  async getOrders() {
    return this.dashboardService.getLatestOrders();
  }

  @Get('activity')
  async getActivity() {
    return this.dashboardService.getRecentActivity();
  }
}