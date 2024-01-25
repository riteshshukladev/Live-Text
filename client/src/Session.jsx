import React,{useState} from 'react'

const Session = ({onGenrateNewKey , onJoinSessionUsingkey})=>{
    const[sessionKey, setSessionKey] = useState('');

    const handleCreateNewKey = () => {
        if(onGenrateNewKey){
            onGenrateNewKey();
        }
    }

    const HandleJoinSession = () => {
        if(onJoinSessionUsingkey){
            onJoinSessionUsingkey(sessionKey);
        }
    }
  return (
    <div>
        <button onClick={handleCreateNewKey}>Generate New Key</button>
        <div>
            <input type="text" 
            placeholder="Enter Key" 
            value={sessionKey}
            onChange={(e) => setSessionKey(e.target.value)}
            />
            <button onClick={HandleJoinSession}>Join Session</button>
        </div>
    </div>
  )
}

export default Session;