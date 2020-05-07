import React from 'react';
import { GetServerSideProps } from 'next';
import useSWR from 'swr';
import Weather from '../../components/Weather';
import fetch from 'unfetch';

interface IProps {
  weather?: string;
}
const WeatherIndex = ({ weather }: IProps) => {
  const { data } = useSWR('/api/weather', (query) => fetch(query).then(r => r.json()));
  return (
    <Weather weather={data?.weather || weather} />
  );
}
export default WeatherIndex;

import { weatherService } from '../api/weather';
export const getServerSideProps: GetServerSideProps<IProps> = async (_) => {
  const data = await weatherService();
  return {
    props: {
      weather: data.weather
    }
  }
}
