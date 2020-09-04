import React from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import PlantStage from '../../components/PlantStage';


import { Plant } from '../../interfaces';
interface IProps {
  plants: Plant[];
}
const Garden = (props: IProps) => {
  //const { plants } = props;
  return (
    <Layout title={"Garden 😌 - Jack Michaud"}>
      <div className="header">
        <div className="app md:flex items-center justify-center">
          <div className="mb-5">
            <Link href="/">
              <span className="text-6xl hover:text-blue-200 cursor-pointer font-mono tracking-tighter">Jack Michaud</span>
            </Link><br/>
            <span className="text-3xl tracking-tight flex items-center">
              Garden: nurturing ideas, projects, and thoughts
            </span><br/>
          </div>
        </div>
      </div>
      <div style={{backgroundColor: "#00142C"}}>
        <div className="app">
          <div className="my-10 text-3xl font-sans uppercase text-blue-200 font-bold">
            Garden
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-24">
            {
              props.plants.map((plant, idx) => (
                <Link href={plant.link} key={idx}>
                  <div className="flex flex-col justify-between p-5" style={{backgroundColor: '#021327'}}>
                    <div className="">
                      <span role="button" className="text-2xl cursor-pointer hover:text-blue-300 text-blue-400 font-bold">{ plant.title }</span> <br/>
                      <span className="text-blue-500">{ plant.description }</span><br/>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        { plant.date }
                      </div>
                      <div>
                        <PlantStage stage={plant.stage} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Garden;

import { NextPageContext } from 'next';

import { getPlantData, generatePlantSlugs } from '../../utils/plants';
export const getStaticProps = async (_: NextPageContext) => {
  const plants = await Promise.all(generatePlantSlugs().map(async slug => {
    const plantData = await getPlantData(slug);
    delete plantData.content;
    return plantData;
  }));

  return {
    props: {
      plants
    }
  }
}
