import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AriClient from 'ari-client';

@Injectable()
export class AriService implements OnModuleInit {
  private readonly logger = new Logger(AriService.name);
  private client: any; // ARI client instance

  private readonly ariUrl: string;
  private readonly ariUsername: string;
  private readonly ariPassword: string;
  private readonly appName: string;
  private readonly outboundEndpoint: string;

  constructor(private readonly configService: ConfigService) {
    const ariConfig = this.configService.get('ari');
    console.log('ariConfig', ariConfig);
    this.ariUrl = ariConfig.url;
    this.ariUsername = ariConfig.username;
    this.ariPassword = ariConfig.password;
    this.appName = ariConfig.appName;
    this.outboundEndpoint = ariConfig.outboundEndpoint;
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
      this.client.on('StasisStart', (event, channel) => {
        this.logger.log(`Channel ${channel.id} entered ${this.appName}`);
        // For demonstration, automatically answer and play a greeting.
        channel
          .answer()
          .then(() => {
            this.logger.log(`Channel ${channel.id} answered`);
            return channel.play({ media: 'sound:thanks-call-later' });
          })
          .catch((err) =>
            this.logger.error(`Error handling channel ${channel.id}:`, err),
          );
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

  async play(channel: any, mediaUrl: string): Promise<void> {
    try {
      await channel.play({ media: mediaUrl });
      this.logger.log(`Playing media ${mediaUrl} on channel ${channel.id}.`);
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

  async dial(callerChannel: any, target: string): Promise<void> {
    try {
      this.logger.log(
        `Dialing target ${target} from channel ${callerChannel.id}.`,
      );
      const newChannel = await this.client.channels.originate({
        endpoint: target,
        app: this.appName,
        callerId: 'NestJSARI',
        timeout: 30,
      });
      newChannel.on('StasisStart', (event, channel) => {
        this.logger.log(
          `Dialed channel ${channel.id} answered; bridging with ${callerChannel.id}.`,
        );
        this.bridgeChannels(callerChannel, channel);
      });
    } catch (err) {
      this.logger.error(
        `Error dialing target ${target} from channel ${callerChannel.id}:`,
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
