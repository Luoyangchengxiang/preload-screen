/*
 * @Date: 2025-09-25 15:29:00
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-25 15:46:32
 * @FilePath: \sourceHTML\preload-screen\examples\react\App.tsx
 */
import React, { useEffect } from "react";

export default function App() {
  useEffect(() => {
    console.log("PreloadScreen instance");
  }, []);

  return (
    <div>
      <h1>React Example</h1>
      <p>The PreloadScreen animation should appear automatically.</p>
    </div>
  );
}
