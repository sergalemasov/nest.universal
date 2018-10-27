import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import {
  Module,
  Inject,
} from '@nestjs/common';
import { DynamicModule } from '@nestjs/common/interfaces';
import { readFileSync } from 'fs';

import { applyDomino } from './utils/domino.utils';
import { AngularUniversalOptions } from './interfaces/angular-universal-options.interface';
import { ANGULAR_UNIVERSAL_OPTIONS } from './angular-universal.constants';
import { AngularUniversalController } from './angular-universal.controller';
import { angularUniversalProviders } from './angular-universal.providers';
import { join } from 'path';

@Module({
  controllers: [AngularUniversalController],
  providers: [...angularUniversalProviders],
})
export class AngularUniversalModule {
  static forRoot(options: AngularUniversalOptions): DynamicModule {
    options = {
      templatePath: join(options.viewsPath, 'index.html'),
      ...options,
    };

    applyDomino(global, options.templatePath);

    const template = readFileSync(options.templatePath).toString();

    return {
      module: AngularUniversalModule,
      providers: [
        {
          provide: ANGULAR_UNIVERSAL_OPTIONS,
          useValue: {
            ...options,
            template,
          },
        },
      ],
    };
  }
}
