export function formatDate(date: string): string {
  const day = new Date(date).getDate();
  // add +1 to month because getMonth() returns month from 0 to 11
  const month = new Date(date).getMonth() + 1;
  const year = new Date(date).getFullYear();

  // show date and month in two digits
  // if day or month is less than 10, add a '0' before it
  const formattedDay = day < 10 ? `0${day}` : `${day}`;
  const formattedMonth = month < 10 ? `0${month}` : `${month}`;

  // now we have day, month, and year
  // use the separator to join them
  return `${formattedMonth}-${formattedDay}-${year}`;
}
