/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Photo } from '../models/Photo';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PhotoService {

    /**
     * Get Recommended Photo
     * @param photosetId
     * @returns Photo Successful Response
     * @throws ApiError
     */
    public static photoGetRecommendedPhoto(
        photosetId: string,
    ): CancelablePromise<Photo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/photoset/{photoset_id}/recommended-photo',
            path: {
                'photoset_id': photosetId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Like Photoset Image
     * @param photosetId
     * @param photoId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static photoLikePhotosetImage(
        photosetId: string,
        photoId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/photoset/{photoset_id}/like/{photo_id}',
            path: {
                'photoset_id': photosetId,
                'photo_id': photoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Dislike Photoset Image
     * @param photosetId
     * @param photoId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static photoDislikePhotosetImage(
        photosetId: string,
        photoId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/photoset/{photoset_id}/dislike/{photo_id}',
            path: {
                'photoset_id': photosetId,
                'photo_id': photoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
