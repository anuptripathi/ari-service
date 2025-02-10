import {
  Injectable,
  OnModuleInit,
  Logger,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AriClient from 'ari-client';
import { CallFlowEngineService, FlowStep } from './call-flow-engine.service';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class AriService implements OnModuleInit {
  private readonly logger = new Logger(AriService.name);
  private client: any; // ARI client instance

  private readonly ariUrl: string;
  private readonly ariUsername: string;
  private readonly ariPassword: string;
  private readonly appName: string;
  private readonly outboundEndpoint: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => CallFlowEngineService))
    private readonly callFlowEngineService: CallFlowEngineService,
  ) {
    const ariConfig = this.configService.get('ari');
    console.log('ariConfig', ariConfig);
    this.ariUrl = ariConfig.url;
    this.ariUsername = ariConfig.username;
    this.ariPassword = ariConfig.password;
    this.appName = ariConfig.appName;
    this.outboundEndpoint = ariConfig.outboundEndpoint;
  }

  async getSavedFlowSteps(): Promise<FlowStep[]> {
    try {
      // Adjust the path to your flow file
      const filePath = path.join(process.cwd(), 'flows', 'flow.json');
      const data = await fs.readFile(filePath, 'utf8');
      const savedFlow = JSON.parse(data);
      // Check if the saved flow uses a "steps" property (if you transformed it in the API route)
      if (savedFlow.steps) {
        return savedFlow.steps;
      }
      // Otherwise, if you saved the complete nodes array, extract the `data` property from each node.
      return savedFlow.nodes.map((node: any) => node.data);
    } catch (error) {
      this.logger.error('Error reading saved flow:', error);
      throw error;
    }
  }

  async onModuleInit() {
    try {
      this.client = await AriClient.connect(
        this.ariUrl,
        this.ariUsername,
        this.ariPassword,
      );
      this.logger.log('Connected to ARI');
      // Start the ARI application
      this.client.start(this.appName);

      // Listen for channels entering the application

      // Inside your ARI service’s StasisStart event handler:
      this.client.on('StasisStart', async (event, channel) => {
        this.logger.log(`Channel ${channel.id} entered the application`);

        // Retrieve the flow definition from the database.
        // For this example, we use a hard-coded flow.
        const savedFlow = await this.getSavedFlowSteps();
        // Execute the flow steps from the saved flow.
        await this.callFlowEngineService.executeFlowSteps(channel, savedFlow);
        // Optionally, set up additional channel event listeners (e.g., for creating CDRs on hangup).
      });
    } catch (err) {
      this.logger.error('Error connecting to ARI:', err);
    }
  }

  // ----------------------------
  // ARI Verb Methods
  // ----------------------------

  async acceptCall(channel: any): Promise<void> {
    try {
      await channel.answer();
      this.logger.log(`Channel ${channel.id} answered.`);
    } catch (err) {
      this.logger.error(`Error answering channel ${channel.id}:`, err);
    }
  }

  async hangup(channel: any): Promise<void> {
    try {
      await channel.hangup();
      this.logger.log(`Channel ${channel.id} hung up.`);
    } catch (err) {
      this.logger.error(`Error hanging up channel ${channel.id}:`, err);
    }
  }

  async play(channel: any, mediaParam: any): Promise<void> {
    try {
      await channel.play(mediaParam);
      this.logger.log(
        `Playing media ${JSON.stringify(mediaParam)} on channel ${channel.id}.`,
      );
    } catch (err) {
      this.logger.error(`Error playing media on channel ${channel.id}:`, err);
    }
  }

  async playDtmf(channel: any, dtmfSequence: string): Promise<void> {
    try {
      for (const digit of dtmfSequence) {
        await channel.sendDTMF({ digit });
        this.logger.log(`Sent DTMF digit ${digit} on channel ${channel.id}.`);
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    } catch (err) {
      this.logger.error(`Error sending DTMF on channel ${channel.id}:`, err);
    }
  }

  async say(channel: any, text: string): Promise<void> {
    try {
      const ttsAudioUrl = await this.getTtsAudioUrl(text);
      await this.play(channel, ttsAudioUrl);
      this.logger.log(`Said "${text}" on channel ${channel.id}.`);
    } catch (err) {
      this.logger.error(`Error in say() on channel ${channel.id}:`, err);
    }
  }

  async gather(
    channel: any,
    options?: { timeout?: number; terminator?: string },
  ): Promise<string> {
    return new Promise((resolve) => {
      let collected = '';
      const timeout = options?.timeout || 5000;
      const terminator = options?.terminator || '#';

      const dtmfListener = (event, ch) => {
        collected += event.digit;
        this.logger.log(
          `Gathered digit ${event.digit} on channel ${channel.id}.`,
        );
        if (event.digit === terminator) {
          channel.removeListener('ChannelDtmfReceived', dtmfListener);
          resolve(collected.slice(0, -1));
        }
      };

      channel.on('ChannelDtmfReceived', dtmfListener);

      setTimeout(() => {
        channel.removeListener('ChannelDtmfReceived', dtmfListener);
        resolve(collected);
      }, timeout);
    });
  }

  sgather(channel: any): any {
    const EventEmitter = require('events');
    const emitter = new EventEmitter();
    const listener = (event, ch) => {
      emitter.emit('dtmf', event.digit);
    };

    channel.on('ChannelDtmfReceived', listener);
    channel.on('StasisEnd', () => {
      channel.removeListener('ChannelDtmfReceived', listener);
      emitter.emit('end');
    });

    return emitter;
  }

  async stream(channel: any): Promise<void> {
    try {
      this.logger.log(
        `Starting bidirectional audio stream on channel ${channel.id}.`,
      );
      // Implementation depends on your media streaming setup.
    } catch (err) {
      this.logger.error(`Error starting stream on channel ${channel.id}:`, err);
    }
  }

  async dial(callerChannel: any, dialParam: any): Promise<void> {
    try {
      this.logger.log(
        `Dialing target ${JSON.stringify(dialParam)} from channel ${callerChannel.id}.`,
      );
      const newChannel = await this.client.channels.originate({
        endpoint: dialParam.target,
        app: this.appName,
        callerId: '1111',
        timeout: 30,
      });
      newChannel.on('StasisStart', (event, channel) => {
        console.log(event);
        this.logger.log(
          `Dialed channel ${channel.id} answered; bridging with ${callerChannel.id}.`,
        );
        this.bridgeChannels(callerChannel, channel);
      });
    } catch (err) {
      this.logger.error(
        `Error dialing target ${JSON.stringify(dialParam)} from channel ${callerChannel.id}:`,
        err,
      );
    }
  }

  async record(channel: any, options?: any): Promise<void> {
    try {
      const recordOptions = {
        name: `recording-${channel.id}`,
        format: 'wav',
        beep: true,
        maxDurationSeconds: 30,
        ifExists: 'overwrite',
        ...options,
      };
      await channel.record(recordOptions);
      this.logger.log(`Recording started on channel ${channel.id}.`);
    } catch (err) {
      this.logger.error(`Error recording channel ${channel.id}:`, err);
    }
  }

  async mute(channel: any): Promise<void> {
    try {
      await channel.mute({ direction: 'in' });
      this.logger.log(`Channel ${channel.id} muted.`);
    } catch (err) {
      this.logger.error(`Error muting channel ${channel.id}:`, err);
    }
  }

  async unmute(channel: any): Promise<void> {
    try {
      await channel.unmute({ direction: 'in' });
      this.logger.log(`Channel ${channel.id} unmuted.`);
    } catch (err) {
      this.logger.error(`Error unmuting channel ${channel.id}:`, err);
    }
  }

  private async bridgeChannels(channel1: any, channel2: any): Promise<void> {
    try {
      const bridge = await this.client.bridges.create({ type: 'mixing' });
      this.logger.log(`Created bridge ${bridge.id}.`);
      await Promise.all([
        bridge.addChannel({ channel: channel1.id }),
        bridge.addChannel({ channel: channel2.id }),
      ]);
      this.logger.log(
        `Channels ${channel1.id} and ${channel2.id} bridged successfully.`,
      );
    } catch (err) {
      this.logger.error(
        `Error bridging channels ${channel1.id} and ${channel2.id}:`,
        err,
      );
    }
  }

  private async getTtsAudioUrl(text: string): Promise<string> {
    // In production, integrate with a TTS service.
    // For demonstration, we simulate by returning a dummy sound reference.
    return `sound:tts-${encodeURIComponent(text)}`;
  }
}
