import { Module } from '@nestjs/common';
import { AriService } from './ari.service';
import { CallFlowEngineService } from './call-flow-engine.service';

@Module({
  providers: [AriService, CallFlowEngineService],
  exports: [AriService, CallFlowEngineService],
})
export class AriModule {}
