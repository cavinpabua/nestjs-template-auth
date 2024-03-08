import { SetMetadata } from '@nestjs/common';

export const IS_APIKEY_ONLY_KEY = 'isApiKeyOnly';

export const IsApiKeyOnly = () => SetMetadata(IS_APIKEY_ONLY_KEY, true);
