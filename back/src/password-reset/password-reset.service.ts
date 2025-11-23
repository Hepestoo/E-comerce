import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordResetToken } from './entities/password-reset.entity';
import { UsersService } from '../usuarios/users.service'; 
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(PasswordResetToken)
    private tokenRepository: Repository<PasswordResetToken>,
    private usersService: UsersService,
    private mailService: MailService,
  ) {}

  async createToken(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      console.log('Usuario no encontrado para reset:', email);
      return { message: 'Si el correo existe, se ha enviado un enlace.' };
    }

    // 1. Generar token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(); // Usamos 'expiresAt' como en tu entidad
    expiresAt.setHours(expiresAt.getHours() + 1);

    // 2. Guardar en BD usando TU estructura
    const resetToken = this.tokenRepository.create({
      tokenHash: token, // Mapeamos el token generado a 'tokenHash'
      expiresAt: expiresAt, // Usamos 'expiresAt'
      user: user,
    });
    
    await this.tokenRepository.save(resetToken);

    // 3. Enviar correo
    await this.mailService.sendPasswordResetEmail(email, token);

    return { message: 'Si el correo existe, se ha enviado un enlace.' };
  }

  async resetPassword(token: string, newPass: string) {
    // Buscamos por 'tokenHash' en lugar de 'token'
    const resetToken = await this.tokenRepository.findOne({
      where: { tokenHash: token },
      relations: ['user'],
    });

    if (!resetToken) throw new BadRequestException('Token inválido');
    
    // Usamos 'expiresAt' para validar la fecha
    if (resetToken.expiresAt < new Date()) {
      await this.tokenRepository.delete(resetToken.id);
      throw new BadRequestException('Token expirado');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPass, salt);
    
    // Actualizamos el usuario
    await this.usersService.updatePassword(resetToken.user.id, hashedPassword);
    
    // Borramos el token usado
    await this.tokenRepository.delete(resetToken.id);

    return { message: 'Contraseña actualizada correctamente' };
  }
}