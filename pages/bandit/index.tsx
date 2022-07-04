import {useState} from 'react';
import ListItem from '../../components/bandit/ListItem';
import Layout from '../../components/Layout'
import {ImageAction, ImageActionChoice, loadBanditImageSet, loadUiTest} from '../../interfaces/bandit';

interface Photo {
  imageUrl: string;
  photosetId: string;
  photoId: string;
  sourceUrl: string;
}

interface BanditIndexProps {
  photos: Photo[];
  uiTest: string; // "1" | "2" | "3"
};

const interact = async (action: ImageActionChoice, photoId: string, photosetId: string) => {
  const body: ImageAction = {
    action,
    photoId,
    photosetId,
  };
  await fetch("/api/bandit/interact", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {"content-type": "application/json"}
  });
}

const BanditIndex = (props: BanditIndexProps) => {
  const {photos, uiTest} = props;
  const [photoIndex, setPhotosIndex] = useState(0);

  const twitterClick = () => interact(ImageActionChoice.like, uiTest, "TwitterFollowUI");

  const [shouldShowResults, setShouldShowResults] = useState(false);

  const photo = photos[photoIndex];
  const nextPhoto = async (action: ImageActionChoice) => {
    try {
      interact(action, photo.photoId, photo.photosetId);
    } catch (e) {
      console.error(e);
    } finally {
      if (photoIndex < photos.length - 1) {
        setPhotosIndex(photoIndex + 1);
      } else {
        // Go to results page
        setShouldShowResults(true);
      }
    }
  }
  const header = (
    <div className="header flex flex-col justify-center items-center">
      <span className="text-6xl text-white">PhotoBandit</span>
      <span className="text-2xl mt-3 text-white">
        You are looking for a nice house. Rate the photos that you think capture the eye-catching qualities of the house.
      </span>
    </div>
  );

  if (shouldShowResults) {
    return (
      <Layout>
        {header}
        <div className="app grid bandit-app">
          <p>
            <span className="text-2xl p-10">Thank you for participating!</span><br/>
            <div className="text-xl p-10">
              <div className="py-2">We've logged your ratings and have adjusted the best photos 🎉</div>
              <br/>
              {uiTest == "1" &&
                <div className="py-2">If you're interested in seeing the results of this experiment, follow <a href="https://twitter.com/_lomz_" target="_blank" onClick={() => twitterClick()}>my Twitter</a> for updates.</div> 

              }
              {uiTest == "2" &&
                <>
                  <div className="py-2">Follow <a href="https://twitter.com/_lomz_" target="_blank" onClick={() => twitterClick()}>my Twitter</a> for updates on this experiment</div> 
                  <a href="https://twitter.com/_lomz_" target="_blank" onClick={() => twitterClick()}>
                    <button className="btn">Curious about this project? Follow me.</button>
                  </a>
                </>
              }
              {uiTest == "3" &&
                <a href="https://twitter.com/_lomz_" target="_blank" onClick={() => twitterClick()}>
                  <button className="btn">Follow me if you want to know the secret experiment</button>
                </a>
              }

              <br/>
              <div className="py-2">If you want to try this experiment again to see how the images changed, try again below.</div><br/>

              <button className="btn" onClick={() => window.location.reload()}>Let's do it again!</button>
            </div>
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {header}
      <div className="app grid bandit-app">
         <ListItem 
             imageUrl={photo.imageUrl}
             onScrollIntoView={() => console.log(`photo ${photo.photoId} scrolled into view`)}
             onClick={() => console.log(`photo ${photo.photoId} clicked`)} />
          <div className="flex justify-between w-full flex-row">
            <button className="btn green w-64 h-32" onClick={() => nextPhoto(ImageActionChoice.like)}>
              Eye catching! ✨
            </button>
            <button className="btn red w-64 h-32" onClick={() => nextPhoto(ImageActionChoice.dislike)}>
              Meh 🥱
            </button>
          </div>
          <span className="text-xl text-center">
            <a href={photo.sourceUrl} target="_blank">(Source)</a>
          </span>
          <span className="text-2xl text-center">
            {photo.photosetId}
          </span>
          <br className="h-64"/>
      </div>
    </Layout>
  );
}

import {
  PhotoService
} from "../../bandit_client";

export const getStaticProps = async (_: any) => {
  const imageSets = await loadBanditImageSet();
  console.log(imageSets);

  const levers = await Promise.all(
    (imageSets).map(async (imageSet): Promise<Photo> => {
      const photo = await PhotoService.photoGetRecommendedPhoto(imageSet.id);
      // Find the image of the given photo ID
      const imageUrl = imageSet.images.find((image) => image.id == photo.photo_id)!.url;
      

      return {
        imageUrl: imageUrl,
        photoId: photo.photo_id,
        photosetId: imageSet.id,
        sourceUrl: imageSet.sourceUrl,
      };
    })
  );

  const uiTestSetId = (await loadUiTest())[0]!.id;
  const uiTestInstance = await PhotoService.photoGetRecommendedPhoto(uiTestSetId);
  const uiTestId = uiTestInstance.photo_id;
  console.log(uiTestId);

  const props: BanditIndexProps = {
      photos: levers,
      uiTest: uiTestId
  };

  return {
    props
  };
}

export default BanditIndex;
