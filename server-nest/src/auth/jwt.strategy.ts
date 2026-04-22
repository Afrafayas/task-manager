import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'secret',
    });
  }

  async validate(payload: any) {
    return { id: payload.user.id };
  }
}   



// ഇത് 3 കാര്യം ചെയ്യുന്നു:

// 1. Token എവിടെ നിന്ന് എടുക്കണം?
// jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
// ← "Authorization: Bearer <token>" header-ൽ നിന്ന്

// 2. Token verify ചെയ്യാൻ ഏത് key?
// secretOrKey: configService.get('JWT_SECRET')
// ← .env-ൽ ഉള്ള JWT_SECRET

// 3. Token valid ആണെങ്കിൽ എന്ത് return?
// async validate(payload: any) {
//   return { id: payload.user.id };
  // ← req.user = { id: "..." } ആകുന്നു
// }




// Request വരുന്നു
//     ↓
// JwtAuthGuard — "Guard check ചെയ്യൂ!"
//     ↓
// JwtStrategy — Token header-ൽ നിന്ന് extract
//     ↓
// JWT_SECRET ഉപയോഗിച്ച് verify
//     ↓
// validate() → req.user = { id: "..." }
//     ↓
// Controller-ലേക്ക് proceed





// "ഈ route-ൽ token check ചെയ്യണം" — enforce
// - Route-ൽ @UseGuards(JwtAuthGuard) ഇട്ടാൽ
// - Strategy run ആകുന്നു
// - Token invalid → 401 Unauthorized
// - Token valid → Controller-ലേക്ക് proceed   