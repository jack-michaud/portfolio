/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Photo } from './Photo';

export type InitializeBanditPayload = {
    photoset_id: string;
    photos: Array<Photo>;
    overwrite?: boolean;
};

