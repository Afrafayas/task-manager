import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './user.schema';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  // REGISTER
  async register(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    // Check existing user
    const existing = await this.userModel.findOne({ email });
    if (existing) throw new BadRequestException('User already exists');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = this.jwtService.sign({ user: { id: user._id } });

    return {
      token,
      user: { id: user._id, name: user.name, email: user.email },
    };
  }

  // LOGIN
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    // Find user
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    // Generate token
    const token = this.jwtService.sign({ user: { id: user._id } });

    return {
      token,
      user: { id: user._id, name: user.name, email: user.email },
    };
  }

  // GET ME
  async getMe(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }
}