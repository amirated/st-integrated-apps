import { useEffect, useState } from "react";
import styled from "styled-components";


const SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = 'en-US'

const Container = styled.div`
	border: 2px solid #9fb6d0;
	padding: 15px;
	border-radius: 10px;
`;

const Hr = styled.hr`
	margin-top: 50px;
`;

const Button = styled.button`
	background: #aeedff;
	margin-right: 5px;
	padding: 15px;
	border-radius: 10px;
`;

const Transcript = styled.div`
	padding: 20px;
	margin-top: 10px;
	margin-bottom: 10px;
	border-radius: 10px;
	background: #bbaabb;
`;

const H2 = styled.h2`
	color: #6c6464;
`;

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
        <Container>
            <H2>Speech to Text Offline</H2>
            <div className="container">
                <div className="box">
                    <Button onClick={() => setIsListening(prevState => !prevState)}>{isListening ? <span>Stop</span> : <span>Start</span>}</Button>
                    <Transcript>{note}</Transcript>
                    <Button onClick={handleSaveNote} disabled={!note}>Save Note</Button>
                </div>
                <Hr/>
                <H2>Notes</H2>
                <Transcript>
                    {saveNotes.map((n: string) => {
                        return <p key={n}>{n}</p>
                    })}

                </Transcript>
            </div>
        </Container>
    )
};