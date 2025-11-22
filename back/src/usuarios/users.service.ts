import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Normaliza búsqueda por email (case-insensitive)
  async findByEmail(email: string): Promise<User | null> {
    const normalized = email.trim().toLowerCase();
    return this.usersRepository.findOne({ where: { email: normalized } });
  }

  // CREATE con comprobación previa y manejo de errores de DB
  async create(userDto: CreateUserDto): Promise<User> {
    // Normalizar email
    const email = userDto.email.trim().toLowerCase();

    // 1) comprobación previa (evita error obvio y da respuesta amigable)
    const existing = await this.findByEmail(email);
    if (existing) {
      throw new ConflictException('El correo ya está registrado');
    }

    // 2) crear usuario (hashear contraseña)
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userDto.password, salt);

    const newUser = this.usersRepository.create({
      nombre: userDto.nombre,
      apellido: userDto.apellido,
      email, // guardamos normalizado
      password: hashedPassword,
      rol: userDto.rol || 'cliente',
      isActive: true,
    });

    // 3) intentar guardar y capturar race condition / constraint error
    try {
      return await this.usersRepository.save(newUser);
    } catch (error) {
      // TypeORM wraps PG errors; 23505 = unique_violation
      const code = (error as any)?.code;
      if (code === '23505') {
        throw new ConflictException('El correo ya está registrado');
      }
      // fallback
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _p, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, username: user.email, role: user.rol };
    console.log('Generated Payload:', payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  
  async getProfile(userId: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }
}
