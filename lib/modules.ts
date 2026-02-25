export const formatDate = (timestamp : number = new Date().getTime()) => {
  if(timestamp === 0){
    return `NO UPDATED`;
  }

  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const formatMonth = month < 10 ? '0' + month : month;
  const formatDay = day < 10 ? '0' + day : day;
  const formatHours = hours < 10 ? '0' + hours : hours;
  const formatMinutes = minutes < 10 ? '0' + minutes : minutes;
  const formatSeconds = seconds < 10 ? '0' + seconds : seconds;


  return `${year}-${formatMonth}-${formatDay} ${formatHours}:${formatMinutes}:${formatSeconds}`;
}