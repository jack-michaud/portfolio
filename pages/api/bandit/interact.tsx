import { NextApiRequest, NextApiResponse } from 'next'
import {PhotoService} from '../../../bandit_client';
import {ImageAction, ImageActionChoice} from '../../../interfaces/bandit';



export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {photosetId, photoId, action} = req.body as ImageAction;
  if (action == ImageActionChoice.like) {
    await PhotoService.photoLikePhotosetImage(photosetId, photoId);
  } else {
    await PhotoService.photoDislikePhotosetImage(photosetId, photoId);
  }

  res.status(200).json({});
}
