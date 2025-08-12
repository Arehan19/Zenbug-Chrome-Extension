const getDeviceInfo = () => {
  return {
    url: window.location.href,
    userAgent: navigator.userAgent,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
  };
};

export default getDeviceInfo;
