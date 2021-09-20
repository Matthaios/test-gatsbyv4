import React, { useEffect } from "react";
export default function ModelViewer({ ...rest }) {
  async function init() {
    await import("@google/model-viewer/dist/model-viewer");
  }
  useEffect(() => {
    if (typeof window !== "undefined") {
      init();
    }
  }, []);
  return (
    <>
      <modal-viewer {...rest}></modal-viewer>
    </>
  );
}
