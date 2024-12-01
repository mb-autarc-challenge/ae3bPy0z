import { useState, useCallback, useEffect, useRef } from "react";

export type BroadcastChannelData =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | undefined
  | null;

export function useBroadcastChannel(
  channelName: string,
  handleMessage: (event: MessageEvent) => void,
  handleMessageError: (event: MessageEvent) => void
): (data: BroadcastChannelData) => void {
  const [channel] = useState<BroadcastChannel | null>(
    new BroadcastChannel(channelName + "-channel")
  );

  useChannelEventListener(channel, "message", handleMessage);
  useChannelEventListener(channel, "messageerror", handleMessageError);

  return useCallback((data) => channel?.postMessage(data), [channel]);
}

function useChannelEventListener<K extends keyof BroadcastChannelEventMap>(
  channel: BroadcastChannel | null,
  event: K,
  handler?: (e: BroadcastChannelEventMap[K]) => void
) {
  const callbackRef = useRef(handler);
  if (callbackRef.current !== handler) {
    callbackRef.current = handler;
  }

  useEffect(() => {
    const callback = callbackRef.current;
    if (!channel || !callback) {
      return;
    }

    channel.addEventListener(event, callback);
    return () => channel.removeEventListener(event, callback);
  }, [channel, event]);
}
