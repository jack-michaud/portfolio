interface IProps {
  weather?: string;
}

const Weather = (props: IProps) => {
  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <pre className="p-2 text-white">{ props.weather }</pre>
    </div>
  );
}
export default Weather;

