import Layout from '../components/Layout'
import GithubIcon from '../components/GithubIcon'
import Separator from '../components/Separator';

interface IProps {
  projects: {
    name: string;
    logo: string;
    description: string;
  }[]
}

const IndexPage = (props: IProps) => (
  <Layout title="🕺Jack Michaud🕺">
    <div className="font-mono">
      <div className="header">
        <div className="app md:flex items-center justify-center">
          <div className="mb-5">
            <span className="text-6xl tracking-tighter">Jack Michaud</span><br/>
            <span className="text-3xl tracking-tight flex items-center leading-3">
              Full Stack Developer 
              <a href="https://github.com/jack-michaud/" target="_blank"><GithubIcon /></a>
            </span><br/>
            <span className="text-blue-300 pr-3">Tools</span>
            <span className="text-blue-400">
              React Vue Django Flask Docker Terraform
              AWS DigitalOcean ArchLinux RaspberryPi
            </span><br/>
            <span className="text-blue-300 pr-3">Languages</span>
            <span className="text-blue-400">
              Python Typescript Java
            </span>
          </div>
          <div className="flex flex-col md:ml-3">
            <a href="#resume" className="btn">Resume</a>
            <a href="#projects" className="btn">Projects</a>
            <a href="#blog" className="btn">Blog</a>
          </div>
        </div>
      </div>
      <div id="resume" className="flex items-center">
        <div className="app">
          <div className="w-full md:flex justify-between items-center">
            <div className="text-3xl font-sans uppercase text-blue-200 font-bold">Resume</div>
            <img className="shadow-sm mx-auto md:mx-0 p-5 md:p-0" src="/images/resume.png"/>
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
              <div className={`my-5 flex ${idx % 2 == 1 && 'flex-row-reverse'}`}>
                <div>
                  <span className="uppercase font-bold text-2xl text-blue-200">{ p.name }</span><br/>
                  <p className="leading-loose">
                    { p.description }
                  </p>
                </div>
                <div className="w-48 mx-3 flex items-center">
                  <img className="min-w-full h-auto" src={p.logo}/>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      <Separator side="left"/>
      <div id="blog" className="flex items-center">
        <div className="app">
          <div className="text-3xl font-sans uppercase text-blue-200 font-bold">
            Blog Posts
          </div>
          <div>
            No blogs yet :)
          </div>
        </div>
      </div>
    </div>
  </Layout>
)

import { NextPageContext } from 'next';
export const getStaticProps = (_: NextPageContext) => {
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
          name: 'Dodocodes.website',
          logo: '/images/Dodocodes-Logo.svg',
          description: `
            A web app for sharing Animal Crossing: New Horizons island codes to allow for authorized strangers to visit your island in a streamlined way. 
          `
        },
        {
          name: 'Ephemeral Minecraft Server',
          logo: '/images/Minecraft-Logo.svg',
          description: `
            My friends wanted a Minecraft server, so I made a Discord bot that boots up a Digital Ocean Droplet with Terraform and runs a Minecraft server process whenever they want it.
          `
        }
      ]
    }
  }
}

export default IndexPage;
