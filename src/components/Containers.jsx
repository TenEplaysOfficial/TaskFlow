import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDragIndicator } from "react-icons/md";
import ContainerCardHandler from "./forms/ContainerCardHandler";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function Containers() {
  const { data, add, remove, updateContainerTitle } = useContext(AppContext);
  const [activeContainer, setActiveContainer] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [popupSettings, setPopupSettings] = useState({
    isOpen: false,
    position: { top: 0, left: 0 },
    containerId: null,
  });

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Check if dropped outside the list
    if (!destination) return;

    const sourceContainer = data.containers.find(
      (container) => container.id === parseInt(source.droppableId)
    );
    const destContainer = data.containers.find(
      (container) => container.id === parseInt(destination.droppableId)
    );

    const [movedCard] = sourceContainer.cards.splice(source.index, 1);
    if (source.droppableId !== destination.droppableId) {
      destContainer.cards.splice(destination.index, 0, movedCard);
    } else {
      sourceContainer.cards.splice(destination.index, 0, movedCard);
    }
  };

  const handleToggle = (containerId) => {
    setActiveContainer((prev) => (prev === containerId ? null : containerId));
    setIsVisible((prev) => (prev === containerId ? false : true));
    setIsEditing(false);
    handleClose();
  };

  const handleAddCard = (cardTitle) => {
    if (activeContainer != null) {
      add(activeContainer, cardTitle);
    }
    setIsVisible(false);
  };

  const handleEditContainer = (container) => {
    setActiveContainer(container.id);
    setIsVisible(true);
    setIsEditing(true);
    handleClose();
  };

  const handleSubmitEdit = (newTitle) => {
    updateContainerTitle(activeContainer, newTitle);
    setIsEditing(false);
  };

  const handleDeleteContainer = (containerId) => {
    remove(containerId, "container");
    handleClose();
  };

  const handleIconClick = (e, containerId) => {
    const { top, left, width } = e.currentTarget.getBoundingClientRect();
    setPopupSettings({
      isOpen: !popupSettings.isOpen,
      position: {
        top: top + window.scrollY + 30,
        left: left + window.scrollX + width / 2 - 75,
      },
      containerId: popupSettings.isOpen ? null : containerId,
    });
  };

  const handleClose = () => {
    setPopupSettings((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <section>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 my-4">
          {data.containers.map((container) => (
            <Droppable key={container.id} droppableId={String(container.id)}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-slate-100 p-4 rounded-lg border border-gray-300 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold tracking-wide text-[1rem]">
                      {container.title}
                    </h3>
                    <div className="flex">
                      <BsThreeDotsVertical
                        onClick={(e) => handleIconClick(e, container.id)}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>

                  {popupSettings.isOpen &&
                    popupSettings.containerId === container.id && (
                      <div
                        className="absolute bg-white border border-gray-300 rounded shadow p-4 lg:w-[7%] text-center space-y-1"
                        style={{
                          top: `${popupSettings.position.top}px`,
                          left: `${popupSettings.position.left}px`,
                        }}
                      >
                        {/* <p>This is the settings popup!</p>
                      <button onClick={handleClose} className="mt-2 p-1 bg-red-500 text-white rounded">
                      Close
                      </button>
                      Add more settings options here */}
                        <button onClick={() => handleEditContainer(container)}>
                          Edit
                        </button>
                        <hr></hr>
                        <button
                          onClick={() => handleDeleteContainer(container.id)}
                          className="text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    )}

                  <div className="flex-1">
                    <Droppable droppableId={String(container.id)}>
                      {(provided) => (
                        <ul
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-3 mb-2"
                        >
                          {container.cards.map((card, index) => (
                            <Draggable
                              key={card.id}
                              draggableId={String(card.id)}
                              index={index}
                            >
                              {(provided) => (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="flex items-center justify-between pl-2 pr-4 bg-white max-h-fit rounded border border-gray-300 shadow min-h-11"
                                >
                                  <p className="flex-1 overflow-hidden break-words py-2 px-1">
                                    {card.title}
                                  </p>
                                  <MdDragIndicator className="text-xl cursor-grab" />
                                </li>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </ul>
                      )}
                    </Droppable>
                  </div>

                  <button
                    onClick={() => handleToggle(container.id)}
                    className="text-center w-full py-2 rounded-lg text-gray-900 font-semibold hover:bg-slate-200"
                  >
                    Add Card
                  </button>
                  {isVisible && activeContainer === container.id && (
                    <ContainerCardHandler
                      onSubmit={isEditing ? handleSubmitEdit : handleAddCard}
                      handleToggle={() => handleToggle(container.id)}
                      title={isEditing ? "Edit Container" : "Add Card"}
                      placeholder="Card Title"
                      btnText={isEditing ? "Update Title" : "Add Card"}
                      toastMSG={
                        isEditing ? "Updated Container" : "Created Card"
                      }
                      initialTitle={isEditing ? container.title : ""}
                      isEdit={isEditing}
                    />
                  )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </section>
    </DragDropContext>
  );
}

export default Containers;
