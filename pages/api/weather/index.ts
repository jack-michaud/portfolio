import { NextApiRequest, NextApiResponse } from 'next'

import fetch from 'isomorphic-unfetch';

export const weatherService = async () => {
  const resp = await fetch('http://wttr.in/seattle?0&A&T');
  return {
    weather: await resp.text()
  }
}

export default (_: NextApiRequest, res: NextApiResponse) => {
  weatherService().then(data => {
    res.status(200).json(data);
  });
}

