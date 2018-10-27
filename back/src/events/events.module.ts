import { Module, Global } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';

@Global()
@Module({
  exports: [EventsService],
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
