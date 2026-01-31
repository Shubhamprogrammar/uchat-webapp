import { useEffect, useState } from "react";

function DesktopOnly({ children }) {
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) setBlocked(true);
  }, []);

  if (blocked) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full p-6 text-center">
          <div className="text-4xl mb-4">💻</div>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Desktop Required!
          </h2>

          <p className="text-gray-600 text-sm">
            Please open this application on a laptop or desktop for the better experience.
          </p>
        </div>
      </div>
    );
  }

  return children;
}

export default DesktopOnly;