import React, { useState } from 'react';

function ReportError({ question }) {
    const [contactInfo, setContactInfo] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(`Reportando error en la pregunta: ${question}`);
        console.log(`Información de contacto: ${contactInfo}`);
        console.log(`Descripción: ${description}`);
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
