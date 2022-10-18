import * as _ from 'lodash';
import { Request } from 'express';
import { Strategy as PassportStrategy } from 'passport-strategy';
import { BadRequestError } from './errors/BadRequestError';

export class Strategy extends PassportStrategy {
  apiKeyHeader: { header: string; prefix: string };
  name: string;
  verify: (
    req: Request,
    apiKey: string,
    verified: (err: Error | null, user?: Object, info?: Object) => void
  ) => void;

  constructor(
    header: { header: string; prefix: string },
    verify: (
      req: Request,
      apiKey: string,
      verified: (err: Error | null, user?: Object, info?: Object) => void
    ) => void
  ) {
    super();
    this.apiKeyHeader = header || { header: 'X-Api-Key', prefix: '' };
    if (!this.apiKeyHeader.header) this.apiKeyHeader.header = 'X-Api-Key';
    if (!this.apiKeyHeader.prefix) this.apiKeyHeader.prefix = '';
    this.apiKeyHeader.header = this.apiKeyHeader.header.toLowerCase();

    this.name = 'headerapikey';
    this.verify = verify;
  }

  authenticate(req: Request, options?: Object): void {
    let apiKey: string = _.get(req.headers, this.apiKeyHeader.header) as string;
    if (!apiKey) {
      return this.fail(new BadRequestError('Missing API Key'), null);
    }

    if (_.startsWith(apiKey, this.apiKeyHeader.prefix)) {
      apiKey = apiKey.replace(new RegExp('^' + this.apiKeyHeader.prefix), '');
    } else {
      return this.fail(
        new BadRequestError(
          'Invalid API Key prefix, ' +
            this.apiKeyHeader.header +
            ' header should start with "' +
            this.apiKeyHeader.prefix +
            '"'
        ),
        null
      );
    }

    let verified = (err: Error | null, user?: Object, info?: Object) => {
      if (err) {
        return this.error(err);
      }
      if (!user) {
        return this.fail(info, null);
      }
      this.success(user, info);
    };

    this.verify(req, apiKey, verified);
  }
}
