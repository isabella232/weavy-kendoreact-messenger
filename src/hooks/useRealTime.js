import { useContext, useEffect, useState } from 'react';
import RealTimeContext from '../realtime-context';

function useRealTime(updateFn, message) {
    const { proxy } = useContext(RealTimeContext);
    const [ lastMessage, setLastMessage ] = useState(null)

    useEffect(() => {
        if (!proxy) return;

        const handleReceiveMessage = (type, data) => {
            switch (type) {
                case message:
                    const json = JSON.parse(data)
                    setLastMessage(json);
                    if(updateFn){
                        updateFn.call(this, json);
                    }
                    
                    break;
                default:
            }
        }

        proxy.on('eventReceived', handleReceiveMessage);

        return () => {
            proxy.off('eventReceived', handleReceiveMessage);
        }
    }, [proxy, message, updateFn]);

    return lastMessage;
}

export default useRealTime;