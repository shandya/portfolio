import React, { useEffect } from "react";
import { Transition } from "@headlessui/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Modal = ({ title, description, image, externalUrl, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.documentElement.classList.remove("overflow-hidden");
    }

    return () => {
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  return (
    <Transition
      show={isOpen}
      enter="transition-opacity duration-150"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 p-8">
        <div
          onClick={onClose}
          className="absolute w-full h-full z-10 bg-black bg-opacity-30 cursor-pointer"
        ></div>

        <div
          style={{ maxHeight: "calc(100vh - 4rem)" }}
          className="max-w-full w-full relative z-20 rounded-lg overflow-auto top-0 bottom-0"
        >
          <div className="w-full max-w-[768px] mx-auto overflow-auto bg-[#31ecff] bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg relative">
            <button
              className="absolute top-4 right-4 text-white w-8 h-8 leading-none opacity-40 ease-in transition-all duration-150 hover:opacity-75 text-3xl"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <div className="flex flex-col md:flex-row w-full">
              {image && (
                <div className="w-full md:w-1/2">
                  <img
                    src={image}
                    alt={title}
                    className="rounded-t-lg md:rounded-none w-full h-64 object-cover"
                  />
                </div>
              )}
              <div className={`w-full ${image ? "md:w-1/2" : ""}`}>
                <div className="p-4 md:p-6 text-white">
                  <h2 className="text-xl font-semibold mb-2">{title}</h2>
                  <p className="mb-4">{description}</p>
                  {externalUrl && (
                    <a
                      href={externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#31ecff] text-sm underline underline-offset-4"
                    >
                      View project ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default Modal;
