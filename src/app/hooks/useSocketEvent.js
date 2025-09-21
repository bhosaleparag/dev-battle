import { useEffect } from "react";

function useSocketEvent(socket, isConnected, event, handler) {
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  }, [socket, isConnected, event, handler]);
}

export default useSocketEvent;
