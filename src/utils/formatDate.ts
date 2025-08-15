export function formatDate(date: string | Date | null | undefined): string {
    if (!date) return '';
  
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
  
    if (isNaN(parsedDate.getTime())) return '';
  
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  
  export function readableDate(date: string | Date | null | undefined): string {
    if (!date) return '';
    
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(parsedDate.getTime())) return '';
    
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[parsedDate.getMonth()];
    const year = parsedDate.getFullYear();
    
    return `${day} ${month} ${year}`;
  }
  