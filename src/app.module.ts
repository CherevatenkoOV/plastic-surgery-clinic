import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import {DoctorsModule} from "./doctors/doctors.module";

@Module({
  imports: [UsersModule, PrismaModule, DoctorsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
