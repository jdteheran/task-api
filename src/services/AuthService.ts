import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { UserModel, type UserDocument } from '../models/User.schema';
import type { User, UserRegistration, UserLogin, UserResponse, AuthResponse } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export class AuthService {
  static async register(userData: UserRegistration): Promise<AuthResponse> {
    // Verificar si el email ya existe
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Verificar si el username ya existe
    const existingUsername = await UserModel.findOne({ username: userData.username });
    if (existingUsername) {
      throw new Error('El nombre de usuario ya está en uso');
    }

    // Validar formato de email
    if (!this.isValidEmail(userData.email)) {
      throw new Error('Formato de email inválido');
    }

    // Validar contraseña
    if (!this.isValidPassword(userData.password)) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Crear usuario
    const newUser = new UserModel({
      username: userData.username,
      email: userData.email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();
    const userResponse = this.toUserResponse(savedUser);
    const token = this.generateToken(userResponse.id);

    return {
      user: userResponse,
      token
    };
  }

  static async login(loginData: UserLogin): Promise<AuthResponse> {
    // Buscar usuario por email
    const user = await UserModel.findOne({ email: loginData.email });
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    const userResponse = this.toUserResponse(user);
    const token = this.generateToken(userResponse.id);

    return {
      user: userResponse,
      token
    };
  }

  static async getUserById(userId: string): Promise<UserResponse | null> {
    const user = await UserModel.findById(userId);
    if (!user) {
      return null;
    }
    return this.toUserResponse(user);
  }

  static verifyToken(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return decoded;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  private static generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  private static toUserResponse(user: UserDocument): UserResponse {
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidPassword(password: string): boolean {
    return Boolean(password && password.length >= 6);
  }
}