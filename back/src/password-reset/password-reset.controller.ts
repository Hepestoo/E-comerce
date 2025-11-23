import { Controller, Post, Body } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';

@Controller('auth')
export class PasswordResetController {
  // Inyectamos SOLO el servicio de PasswordReset
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Post('request-password-reset')
  async requestReset(@Body('email') email: string) {
    // Delegamos la tarea al servicio (que guarda en BD y envía el mail)
    return this.passwordResetService.createToken(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; password: string }) {
    return this.passwordResetService.resetPassword(body.token, body.password);
  }
}