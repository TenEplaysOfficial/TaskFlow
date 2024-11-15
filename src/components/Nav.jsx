import { useContext, useState } from "react";
import ContainerCardHandler from "./forms/ContainerCardHandler";
import { AppContext } from "../context/AppContext";

function Nav() {
  const { addContainer} = useContext(AppContext);
  const [isVisible, setIsVisible] = useState(false);

  const handleToggle = () => {
    setIsVisible((pre) => !pre);
  };

  const handleAddContainer = (title) => {
    addContainer(title);
  };

 

  return (
    <header className="flex justify-between items-center border-b-2 pb-4">
      <div>
        <h2 className="text-3xl text-gray-800 font-bold select-none">
          TaskFlow
        </h2>
      </div>
      <div>
        <button
          onClick={handleToggle}
          className="bg-indigo-500 text-white text-sm sm:text-lg py-2 px-4 border-none font-semibold rounded-lg hover:shadow-lg transform duration-300 hover:bg-indigo-600 hover:scale-[102%]"
        >
          Add Container
        </button>
        {isVisible && (
          <ContainerCardHandler onSubmit={handleAddContainer}   handleToggle={handleToggle} title="Add Container" placeholder="Container Title" btnText="Add Container" toastMSG="Created Container" />
        )}
      </div>
    </header>
  );
}

export default Nav;
