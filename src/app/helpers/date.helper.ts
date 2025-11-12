/**
 * Formatea una fecha en formato dd/mm/YYYY sin mostrar la hora
 * @param date - Fecha en formato string o Date
 * @returns Fecha formateada como dd/mm/YYYY o string vacío si no es válida
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Verificar si la fecha es válida
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.warn('Error formateando fecha:', date, error);
    return '';
  }
}

