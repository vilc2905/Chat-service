
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useState } from 'react';

firebase.initializeApp({
  apiKey: "AIzaSyDTBptzFEuH8iW8Up5uKUYYlZX86v4DTKU",
  authDomain: "chatservice-97b7d.firebaseapp.com",
  projectId: "chatservice-97b7d",
  storageBucket: "chatservice-97b7d.appspot.com",
  messagingSenderId: "1022592161812",
  appId: "1:1022592161812:web:23215d55c7da328514ef01",
  measurementId: "G-0T7FBTP27X"
})

const auth = firebase.auth();
const firestore = firebase.firestore(); 

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
      <SignOut />

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      
      </section>

      </header>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => { 
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (<button onClick={signInWithGoogle}>Sign in with Google</button>)
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const message = firestore.collection('messages');
  const query = message.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    //Disable page refresh on the event
    e.preventDefault();
    const {uid, photoURL} = auth.currentUser;
    //Write new document to firestore
    await message.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid, 
      photoURL 
    });
    //Reset formValue
    setFormValue('');
  }

  return (
    <>
      <div>
        {messages && messages.map(msg => 
          <ChatMessage key={msg.id} message={msg} />)}
      </div>

      <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>

      <button type="submit">Test</button>
      
      </form>
    </>
    );
}



function ChatMessage(props) { 
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img src={photoURL}/>
        <p>{text}</p>
      </div>
  </>)
}

export default App;
