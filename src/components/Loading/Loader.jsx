import { HashLoader } from "react-spinners";

const Loader = ({ fullScreen = true }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <HashLoader color="#ffffff" size={80} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <HashLoader color="#553838" size={50} />
    </div>
  );
};

export default Loader;