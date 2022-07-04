/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EpsilonGreedyState } from '../models/EpsilonGreedyState';
import type { InitializeBanditPayload } from '../models/InitializeBanditPayload';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class BanditService {

    /**
     * Initialize Bandit
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static banditInitializeBandit(
        requestBody: InitializeBanditPayload,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/bandit/initialize',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Photoset State
     * @param photosetId
     * @returns EpsilonGreedyState Successful Response
     * @throws ApiError
     */
    public static banditGetPhotosetState(
        photosetId: string,
    ): CancelablePromise<EpsilonGreedyState> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/bandit/{photoset_id}',
            path: {
                'photoset_id': photosetId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
