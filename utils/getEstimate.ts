// m => 12km/h
export const getEstimate = (distance: number) => {
  let speed;

  if (distance < 1000) {
    speed = 12000;
  } else if (distance < 5000) {
    speed = 10000;
  } else {
    speed = 7500;
  }

  // xm
  // 12000m/60분
  // (12000/60) /1분

  // mh
  // m/h * h
  // xm    km/h

  // km/h

  console.log({ distance, speed });

  const hours = distance / speed;

  if (hours < 1) {
    return {
      minute: Math.floor(hours * 60),
    };
  }

  return {
    hour: Math.floor(hours),
    minute: Math.floor((hours * 60) % 60),
  };
};
