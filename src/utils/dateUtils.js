// Helper function to format ISO date to readable format
export const formatDateTime = (isoString) => {
    if (!isoString) return "-";

    const date = new Date(isoString);
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
    const formattedHours = String(hours).padStart(2, '0');
    
    return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
};


export const formatDate = (isoString) => {
    if (!isoString) return "-";

    const date = new Date(isoString);

    return date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
    });
};