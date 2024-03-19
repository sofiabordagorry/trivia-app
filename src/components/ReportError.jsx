import React, { useState } from 'react';
import emailjs from 'emailjs-com';

function ReportError({ question, closeModal }) {
    const [contactInfo, setContactInfo] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        emailjs.send('service_lvo4prx', 'template_zzdi674', {
            to_name: 'Sofi', // Reemplaza esto con tu nombre
            from_name: contactInfo,
            message: `Error en la pregunta: ${question}\nDescripción del error: ${description}`
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
                Descripción del error:
                <textarea value={description} onChange={e => setDescription(e.target.value)} />
            </label>
            <input type="submit" value="Reportar error" />
        </form>
    );
}

export default ReportError;
