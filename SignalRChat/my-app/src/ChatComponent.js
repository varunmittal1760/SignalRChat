import React, { useEffect, useState } from 'react';
import connection from './signalr'; // Import the connection object

const ChatComponent = () => {
    const [numbers, setNumbers] = useState([]);

    useEffect(() => {
        connection.on("ReceiveNumber", (user, number) => {
            setNumbers((prevNumbers) => [...prevNumbers, number]);
        });

        connection.start()
            .then(() => {
                // Connection established
            })
            .catch((error) => {
                console.error(error);
            });

        // Clean up the connection when the component unmounts
        return () => {
            connection.stop();
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const number = Math.floor(Math.random() * 100);
            connection.invoke("SendNumber", "User", number)
                .catch((error) => {
                    console.error(error);
                });
        }, 2000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div>
            <h1>Random Numbers</h1>
            <ul>
                {numbers.map((number, index) => (
                    <li key={index}>{number}</li>
                ))}
            </ul>
        </div>
    );
};

export default ChatComponent;
