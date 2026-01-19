import { Module } from '@nestjs/common';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { AdminController } from './admin.controller';

@Module({
    imports: [ProfilesModule],
    controllers: [AdminController],
    providers: [] 
})
export class AdminModule {}
