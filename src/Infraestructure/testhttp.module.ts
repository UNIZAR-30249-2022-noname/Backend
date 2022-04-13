import { Module } from '@nestjs/common';
import { TestController } from './Adapters/testhttp.controller';

@Module({
  controllers: [TestController],
})
export class TestHttpModule{}