import { useEffect } from "react";

const useWindowResize = (callback = () => {}, debounceInterval = 50) => {
  useEffect(() => {
    let timer = null;

    const handleResize = () => {
      if (!timer) {
        timer = setTimeout(() => {
          callback({
            height: window.innerHeight,
            width: window.innerWidth,
          });
          timer = null;
        }, debounceInterval);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);
};

export default useWindowResize;
