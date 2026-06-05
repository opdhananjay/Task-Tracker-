import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  width = "max-w-md",
  maxHeight = "max-h-[80vh]", // 80% of viewport height
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`bg-white p-4 rounded-md m-2 shadow-lg w-full ${width} ${maxHeight} overflow-y-auto flex flex-col`}>
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="font-semibold text-lg text-gray-600">{title}</h2>
          <button onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Modal;