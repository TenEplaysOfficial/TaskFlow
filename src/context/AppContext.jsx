import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const storedData = localStorage.getItem("appData");
    return storedData ? JSON.parse(storedData) : { containers: [] };
  });

  useEffect(() => {
    localStorage.setItem("appData", JSON.stringify(data));
  }, [data]);

  const addContainer = (title) => {
    const newContainer = {
      id: Date.now(),
      title,
      cards: [],
    };
    setData((prevData) => {
      const updatedData = {
        ...prevData,
        containers: [...prevData.containers, newContainer],
      };
      return updatedData;
    });
  };

  const add = (containerId, cardTitle) => {
    setData((prevData) => {
      const updatedData = {
        ...prevData, // Copy entire data structure
        containers: prevData.containers.map((container) =>
          container.id === containerId
            ? {
                ...container,
                cards: [
                  ...container.cards,
                  { id: Date.now(), title: cardTitle },
                ],
              }
            : container
        ),
      };
      return updatedData;
    });
  };

  const remove = (id, type) => {
    if (type === "container") {
      setData((prevData) => ({
        containers: prevData.containers.filter(
          (container) => container.id !== id
        ),
      }));
    } else if (type === "card") {
      setData((prevData) => ({
        containers: prevData.containers.map((container) => ({
          ...container,
          cards: container.cards.filter((card) => card.id !== id),
        })),
      }));
    }
  };

  const updateContainerTitle = (id, newTitle) => {
    setData((prevData) => ({
      containers: prevData.containers.map((container) =>
        container.id === id ? { ...container, title: newTitle } : container
      ),
    }));
  };

  const value = {
    data,
    addContainer,
    add,
    remove,
    updateContainerTitle,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AppProvider, AppContext };
