import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { StorageService } from '../../shared/storage/storage.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly storageService: StorageService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = request.session.userId;
    
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }
    
    try {
      const user = await this.storageService.getUserById(userId);
      if (!user) {
        throw new UnauthorizedException('Not authenticated');
      }
      
      // Attach user to request for later use
      (request as any).user = user;
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Not authenticated');
    }
  }
}