import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";
import PropTypes from "prop-types";
import gsap from "gsap";

function ContainerCardHandler({
  handleToggle,
  onSubmit,
  title,
  placeholder = "Type...",
  btnText = "Submit",
  toastMSG = "Notification",
  initialTitle,
  isEdit,
}) {
  const [inputTitle, setInputTitle] = useState(initialTitle);
  const popupRef = useRef(null);

  useEffect(() => {
    // Animate popup in
    gsap.fromTo(
      popupRef.current,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" }
    );
  }, []);

  const submitForm = async (e) => {
    e.preventDefault();
    if (inputTitle.trim()) {
      try {
        await onSubmit(inputTitle);
        toast.success(`${toastMSG}: ${inputTitle}`);
        setInputTitle("");
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      } finally {
        // Animate popup out before closing
        gsap.to(popupRef.current, {
          scale: 0.5,
          opacity: 0,
          duration: 0.5,
          ease: "power3.in",
          onComplete: handleToggle,
        });
      }
    } else {
      toast.error("Please enter a valid title.");
    }
  };

  const isTitleChanged = inputTitle !== initialTitle;

  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm">
      <div
        ref={popupRef}
        className="relative border-2 border-black p-4 flex flex-col items-center rounded-lg  sm:w-full bg-white sm:max-w-md"
      >
        <IoClose
          onClick={handleToggle}
          className="absolute top-2 right-2 cursor-pointer hover:scale-105 opacity-50 hover:opacity-100 hover:rotate-6 transform duration-150"
        />
        <h2 className="font-black text-2xl">{title}</h2>
        <form
          onSubmit={submitForm}
          className="flex flex-col mt-2 w-full h-auto space-y-3"
        >
          <input
            type="text"
            placeholder={placeholder}
            onChange={(e) => setInputTitle(e.target.value)}
            className="bg-slate-200 rounded-md px-2 py-1 outline-none my-2 placeholder-slate-500 border focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={inputTitle === ""}
            className={`bg-indigo-500 p-1 text-white rounded-lg font-semibold tracking-wide text-sm sm:text-lg ${!inputTitle ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            {isEdit && isTitleChanged ? "Update Title" : btnText}
          </button>
        </form>
      </div>
    </div>
  );
}

ContainerCardHandler.propTypes = {
  handleToggle: PropTypes.func.isRequired,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  btnText: PropTypes.string,
  toastMSG: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  initialTitle: PropTypes.string,
  isEdit: PropTypes.bool,
};

export default ContainerCardHandler;
