import React, { useState } from 'react';
import emailjs from 'emailjs-com';

function SuggestQuestion({ question, closeModal }) {
    const [contactInfo, setContactInfo] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        emailjs.send('service_lvo4prx', 'template_4cf9rei', {
            to_name: 'Sofi', // Reemplaza esto con tu nombre
            from_name: contactInfo,
            message: `Sugerencia: ${description}`
        }, 'ZAprI1VngIigjxKyv')
            .then((result) => {
                console.log(result.text);
                closeModal(); // cierra la ventana emergente
            }, (error) => {
                console.log(error.text);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Información de contacto:
                <input type="text" value={contactInfo} onChange={e => setContactInfo(e.target.value)} />
            </label>
            <label>
                Sugerencia:
                <textarea value={description} onChange={e => setDescription(e.target.value)} />
            </label>
            <input type="submit" value="Enviar sugerencia" />
        </form>
    );
}

export default SuggestQuestion;
