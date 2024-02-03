

import React, { useState } from 'react';

const Session = ({ onGenerateNewKey, onJoinSessionUsingKey, onLeaveSession }) => {
    const [sessionKey, setSessionKey] = useState('');

    return (
        <div>
            <button onClick={onGenerateNewKey}>Generate New Key</button>
            <div>
                <input 
                    type="text" 
                    placeholder="Enter Key" 
                    value={sessionKey}
                    onChange={(e) => setSessionKey(e.target.value)}
                />
                <button onClick={() => onJoinSessionUsingKey(sessionKey)}>Join Session</button>
            </div>
            <button onClick={onLeaveSession}>Leave Session</button>
        </div>
    );
};

export default Session;
