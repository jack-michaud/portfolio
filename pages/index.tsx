import Layout from '../components/Layout'
import GithubIcon from '../components/GithubIcon'
import Separator from '../components/Separator';
import EthWave from '../components/EthWave';



const IndexPage = () => (
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
      <div id="ethwave" className="pt-5">
        <div className="app">
          <div className="text-3xl font-sans uppercase text-blue-200 font-bold">
            Waves
          </div>
          <EthWave />
        </div>
      </div>

      <Separator side="left"/>
      <div id="garden" className="flex items-center">
        <div className="app my-24">
          <div className="flex flex-col items-center">
            <div className="mr-2">
              <img src="/images/Forest.svg" />
            </div>
            <div className="flex flex-col">
              <div className="text-3xl font-sans uppercase text-blue-200 font-bold">
                Garden
              </div>
              I replaced my garden on this site with a new Obsidian Publish vault. I've been stewing on it for about 6 months now. Check it out:<br/><br/>

              <div className="w-full flex justify-center">
                <a href="https://publish.obsidian.md/lomz"><button className="btn">Go to Orpheus</button></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
)


export default IndexPage;
