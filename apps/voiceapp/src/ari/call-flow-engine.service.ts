import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { AriService } from './ari.service';

// Define the interface for a flow step.
export interface FlowStep {
  verb: string;
  params: Record<string, any>;
  onSuccess?: FlowStep[];
  onFailure?: FlowStep[];
}

@Injectable()
export class CallFlowEngineService {
  private readonly logger = new Logger(CallFlowEngineService.name);
  private readonly verbMap: Record<string, Function>;

  constructor(
    @Inject(forwardRef(() => AriService))
    private readonly ariService: AriService,
  ) {
    // Map each verb to the corresponding method in AriService.
    this.verbMap = {
      accept: this.ariService.acceptCall.bind(this.ariService),
      hangup: this.ariService.hangup.bind(this.ariService),
      play: this.ariService.play.bind(this.ariService),
      playDtmf: this.ariService.playDtmf.bind(this.ariService),
      say: this.ariService.say.bind(this.ariService),
      gather: this.ariService.gather.bind(this.ariService),
      sgather: this.ariService.sgather.bind(this.ariService),
      stream: this.ariService.stream.bind(this.ariService),
      dial: this.ariService.dial.bind(this.ariService),
      record: this.ariService.record.bind(this.ariService),
      mute: this.ariService.mute.bind(this.ariService),
      unmute: this.ariService.unmute.bind(this.ariService),
    };
  }

  /**
   * Executes an array of flow steps sequentially on the given channel.
   * Each step may have branching logic based on success or failure.
   */
  async executeFlowSteps(channel: any, steps: FlowStep[]): Promise<void> {
    for (const step of steps) {
      await this.executeStep(channel, step);
    }
  }

  /**
   * Executes a single flow step. If the step succeeds, its onSuccess branch (if any) is executed;
   * if it fails, the onFailure branch is executed.
   */
  async executeStep(channel: any, step: FlowStep): Promise<void> {
    if (step.verb === 'hangup') {
      console.log('hangup called.');
      return;
    }
    const verbFunction = this.verbMap[step.verb];
    if (!verbFunction) {
      this.logger.error(`Unknown verb "${step.verb}" encountered.`);
      return;
    }
    this.logger.log(
      `Executing "${step.verb}" with params ${JSON.stringify(step.params)}`,
    );
    try {
      // Execute the verb. Adjust parameter passing as needed.
      await verbFunction(channel, step.params);
      this.logger.log(`Step "${step.verb}" succeeded.`);
      if (step.onSuccess && step.onSuccess.length > 0) {
        this.logger.log(`Executing onSuccess branch for "${step.verb}".`);
        await this.executeFlowSteps(channel, step.onSuccess);
      }
    } catch (err) {
      this.logger.error(`Step "${step.verb}" failed.`, err);
      if (step.onFailure && step.onFailure.length > 0) {
        this.logger.log(`Executing onFailure branch for "${step.verb}".`);
        await this.executeFlowSteps(channel, step.onFailure);
      }
    }
  }
}
