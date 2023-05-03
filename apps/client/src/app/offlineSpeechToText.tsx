import { useEffect, useState } from "react";


const SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = 'en-US'

export const OfflineSpeechToText = () => {
    const [isListening, setIsListening] = useState<boolean>(false);
    const [note, setNote] = useState<string>('');
    const [saveNotes, setSaveNotes] = useState<string[]>([]);

    useEffect(() => {
        handleListen();
    }, [isListening])

    const handleListen = () => {
        if (isListening) {
            mic.start();
            mic.onend = () => {
                console.log('continue...')
                mic.start()
            }
        } else {
            mic.stop()
            mic.onend = () => {
                console.log('Listening stopped.')
            }
        }

        mic.onstart = () => {
            console.log('Mic started now');
        }

        mic.onresult = (event: { results: SpeechRecognitionResult[] }) => {
            var transcript;
            transcript = Array.from(event.results).map((alternative: any) => alternative[0].transcript).join('');
            setNote(transcript);
            
            mic.onerror = (event: { err: any; }) => {
                console.log(event.err);
            }
        }
    }

    const handleSaveNote = () => {
        setSaveNotes([...saveNotes, note]);
        setNote('');
    }

    return (
        <div className="wrapper">
            <h1>Speech to Text Offline</h1>
            <div className="container">
            <div className="box">
                <h2>Current Note</h2>
                {isListening ? <span>🎙️</span> : <span>🚫🎙️</span>}
                <button onClick={handleSaveNote} disabled={!note}>Save Note</button>
                <button onClick={() => setIsListening(prevState => !prevState)}>Start/Stop</button>
                <p>{note}</p>
            </div>
            <div className="box">
                <h2>Notes</h2>
                {saveNotes.map((n: string) => {
                    return <p key={n}>{n}</p>
                })}
            </div>
            </div>
        </div>
    )
};