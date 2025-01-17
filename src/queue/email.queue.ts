import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('email')
export class EmailQueue {
  @Process()
  async handleEmail(job: Job) {
    console.log('Processing email:', job.data);
  }
}
