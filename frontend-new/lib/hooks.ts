import { viewportAtom } from "@/lib/jotai";
import { useAtom } from "jotai";
import { useEffect } from "react";

export const useViewport = () => {
    const [viewport, setViewport] = useAtom(viewportAtom)
    
    useEffect(() => {
        const handleWindowResize = () => {
            setViewport({width: window.innerWidth, height: window.innerHeight})
        }

        if (viewport.width === 0 || viewport.height === 0) {
            handleWindowResize()
        }

        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);
  
    // Return both the height and width
    return viewport;
  }