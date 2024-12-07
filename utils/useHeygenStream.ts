// hooks/useHeyGenStream.ts
import { useEffect, useRef, useState } from 'react';
import StreamingAvatar, { AvatarQuality, StreamingEvents } from '../sdk/index';
import { SpeakRequest, TaskMode, TaskType } from '@heygen/streaming-avatar';

const useHeyGenStream = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const avatarRef = useRef<StreamingAvatar | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const initializeAvatar = async () => {
      const token = 'MjA5MWJjOGQyMjc3NDcxNTlkYTkxODlkN2VlOGYxODAtMTczMTE0MzkyNA==';
      avatarRef.current = new StreamingAvatar({ token });

      const sessionData = await avatarRef.current.createStartAvatar({
        quality: AvatarQuality.High,
        avatarName: 'default',
      });

      avatarRef.current.on(StreamingEvents.STREAM_READY, (event) => {
        if (videoRef.current && event.detail) {
            setIsReady(true)
          videoRef.current.srcObject = event.detail;
          videoRef.current.play();
        }
      });
    };

    initializeAvatar();

    return () => {
      avatarRef.current?.stopAvatar();
    };
  }, []);

  const sendTask = (text: string) => {
    if (isReady && avatarRef.current) {
        const speakRequest: SpeakRequest = {
            text: text,
            taskType: TaskType.REPEAT, 
            taskMode: TaskMode.SYNC, 
          };      
        avatarRef.current.speak(speakRequest as any)
        console.log('Task sent:', text);
    } else {
      console.warn('Stream is not ready. Task not sent.');
    }
  };

  return { videoRef, sendTask, isReady };
};

export default useHeyGenStream;
