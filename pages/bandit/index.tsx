import {useState} from 'react';
import ListItem from '../../components/bandit/ListItem';
import Layout from '../../components/Layout'
import {loadBanditImageSet} from '../../interfaces/bandit';

interface Lever {
  imageUrl: string;
  leverId: string;
}

interface BanditIndexProps {
  levers: Lever[];
};
const BanditIndex = (props: BanditIndexProps) => {
  const levers = props.levers;
  const [photoIndex, setPhotosIndex] = useState(0);

  const lever = levers[photoIndex];
  const nextPhoto = (action: "approve" | "deny") => {
    console.log(`${action} ${lever.leverId}`);
    if (photoIndex >= levers.length - 1) {
      // Go to results page
      return;
    }
    setPhotosIndex(photoIndex + 1);
  }

  return (
    <Layout>
      <div className="header flex flex-col justify-center items-center">
        <span className="text-6xl text-white">PhotoBandit</span>
        <span className="text-2xl mt-3 text-white">Click photos that catch your eye</span>
      </div>
      <div className="app grid bandit-app">
         <ListItem 
             imageUrl={lever.imageUrl}
             onScrollIntoView={() => console.log(`lever ${lever.leverId} scrolled into view`)}
             onClick={() => console.log(`lever ${lever.leverId} clicked`)} />
          <div className="flex justify-between w-full flex-col md:flex-row">
            <button className="btn green" onClick={() => nextPhoto("approve")}>
              Approve
            </button>
            <button className="btn red" onClick={() => nextPhoto("deny")}>
              Deny
            </button>
          </div>
      </div>
    </Layout>
  );
}

export const getStaticProps = async (_: any) => {
  const imageSets = await loadBanditImageSet();
  console.log(imageSets);
  return {
    props: {
      levers: (imageSets).map((imageSet) => {
        const imageUrl = imageSet.images[1].url;
        return {
          imageUrl: imageUrl,
          leverId: imageUrl,
        };
      }),
    }
  };
}

export default BanditIndex;
