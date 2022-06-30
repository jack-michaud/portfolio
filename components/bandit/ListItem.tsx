import {useEffect, useRef, useState} from "react"

function useOnScreen(ref: any) {

  const [isIntersecting, setIntersecting] = useState(false)


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting)
    );
    observer.observe(ref.current)
    // Remove the observer as soon as the component is unmounted
    return () => { observer.disconnect() }
  }, []);

  return isIntersecting;
}

interface ListItemProps {
  imageUrl: string;
  onClick: Function;
  onScrollIntoView: Function;
};
const ListItem = (props: ListItemProps) => {
  const ref = useRef()
  const isVisible = useOnScreen(ref);
  useEffect(() => {
    if (isVisible) {
      props.onScrollIntoView();
    }
  }, [isVisible]);
  return (
    <div ref={ref} className="bandit-listitem" onClick={(_) => props.onClick()}>
      <img src={props.imageUrl} />
    </div>
  );
}

export default ListItem;
