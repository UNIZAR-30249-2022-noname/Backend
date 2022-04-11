import { Module } from '@nestjs/common';
import { TestController } from './testhttp.controller';

@Module({
  controllers: [TestController],
})
export class TestHttpModule{}