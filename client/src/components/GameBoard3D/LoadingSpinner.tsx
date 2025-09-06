import { useEffect, useState } from "react";
import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
  isVisible: boolean;
}

const LoadingSpinner = ({ isVisible }: LoadingSpinnerProps) => {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      // delay unmounting to allow fade-out animation
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <div className={`loading-overlay ${!isVisible ? "fade-out" : ""}`}>
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
