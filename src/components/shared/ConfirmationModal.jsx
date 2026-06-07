const ConfirmationModal = ({
    isOpen,
    title,
    description,
    confirmText = 'Yes',
    cancelText = 'No',
    onConfirm,
    onCancel,
}) => {

    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shddow-lg w-full max-w-md">

                <div className="p-6">
                    
                    <h2 className="text-lg font-semibold text-gray-800">
                        {title}
                    </h2>

                    <p className="mt-2 text-sm text-gray-600">
                        {description}
                    </p>

                </div>

                <div className="flex justify-end gap-2 botder-t p-4">

                    <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300" onClick={onCancel}>
                        {cancelText}
                    </button>

                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={onConfirm}>
                        {confirmText}
                    </button>

                </div>

            </div>
        </div>
    )
}

export default ConfirmationModal