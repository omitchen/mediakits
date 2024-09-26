const isMobile = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.match(
    /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
  );
};

export default isMobile;
