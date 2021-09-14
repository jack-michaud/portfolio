import Layout from '../components/Layout'
import GithubIcon from '../components/GithubIcon'
import Separator from '../components/Separator';
import PlantStage from '../components/PlantStage';
import Link from 'next/link';

import { Plant } from '../interfaces';
interface IProps {
  projects: {
    name: string;
    logo: string;
    description: string;
  }[];
  plants: Plant[]
}

const IndexPage = (props: IProps) => (
  <Layout>
    <div className="font-mono overflow-x-hidden">
      <div className="header">
        <div className="app md:flex items-center justify-center">
          <div className="mb-5">
            <span className="text-6xl tracking-tighter">Jack Michaud</span><br/>
            <span className="text-3xl tracking-tight flex items-center">
              Full Stack Developer 
              <a href="https://github.com/jack-michaud/" target="_blank"><GithubIcon /></a>
            </span><br/>
            <span className="text-blue-300 pr-3">Tools</span>
            <span className="text-blue-400">
              FastAPI Flask Django
              React Vue 
              Docker 
              Terragrunt Terraform
              AWS DigitalOcean 
              NixOS ArchLinux 
              System76 RaspberryPi
            </span><br/>
            <span className="text-blue-300 pr-3">Languages</span>
            <span className="text-blue-400">
              Python Typescript Golang Rust Java
            </span>
          </div>
          <div className="flex flex-col md:ml-3">
            <a href="#resume" className="btn">Resume</a>
            <a href="#projects" className="btn">Projects</a>
            <a href="#garden" className="btn">Garden</a>
          </div>
        </div>
      </div>
      <div id="resume" className="flex items-center">
        <div className="app">
          <div className="w-full md:flex justify-between items-center">
            <div className="text-3xl font-sans uppercase text-blue-200 font-bold">Resume</div>
            <a href="/docs/JackMichaudResume.pdf">
              <img className="shadow-sm mx-auto md:mx-0 p-5 md:p-0" src="/images/resume.png"/>
            </a>
          </div>
        </div>
      </div>
      <Separator side="right"/>
      <div id="projects" className="flex items-center">
        <div className="app my-5">
          <div className="text-3xl font-sans uppercase text-blue-200 font-bold">
            Project Highlights
          </div>
          {
            props.projects.map( (p, idx) => (
              <div className={`my-5 md:flex ${idx % 2 == 1 && 'md:flex-row-reverse'}`}>
                <div className="w-48 mx-auto my-3 md:mx-3 flex items-center">
                  <img className="min-w-full h-auto" src={p.logo}/>
                </div>
                <div>
                  <span className="uppercase font-bold text-2xl text-blue-200">{ p.name }</span><br/>
                  <p className="leading-loose">
                    { p.description }
                  </p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      <Separator side="left"/>
      <div id="garden" className="flex items-center">
        <div className="app my-10">
          <Link href="/garden">
            <div className="text-3xl font-sans uppercase text-blue-200 font-bold">
              Garden
            </div>
          </Link>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  </Layout>
)

import { NextPageContext } from 'next';

import { getPlantData, generatePlantSlugs } from '../utils/plants';
export const getStaticProps = async (_: NextPageContext) => {
  const plants = await Promise.all(generatePlantSlugs().map(async slug => {
    const plantData = await getPlantData(slug);
    delete plantData.content;
    return plantData;
  }));

  return {
    props: {
      projects: [
        {
          name: 'Metascouter',
          logo: '/images/Metascouter-Logo.svg',
          description: `
            A live computer vision data collection program for collecting data from 
            esports gameplay. We also provide broadcast graphics for major Super
            Smash Brothers tournaments using this data.
          `
        },
        {
          name: 'Harrow Search',
          logo: '/images/Harrow-Logo.png',
          description: `
          A web scraper designed for online casing of subjects suspected of committing insurance fraud. It scrapes Facebook, Twitter, and Instagram and generates CSV, PDF, and interactive web reports of activity.
          `
        },
        {
          name: 'Ephemeral Minecraft Server',
          logo: '/images/Minecraft-Logo.svg',
          description: `
            My friends wanted a Minecraft server, so I made a Discord bot that boots up a Digital Ocean Droplet with Terraform and runs a Minecraft server process whenever they want it.
          `
        }
      ],
      plants
    }
  }
}


export default IndexPage;
