const express = require('express');
const wa = require('@open-wa/wa-automate');

const app = express();

const pessoas = {
    'duda': 'mor 💙',
    'pai': 'pai',
    'mãe': 'mãe',
    'sargento lucas': 'sargento lucas',        
    'mateus': 'matias',    
};

const start = async (client) => {

    const contacts = await client.getAllContacts();
    app.get('/sendmessage', async (req, res) => {
        const { name, message } = req.query;
        console.log(`name: ${name} message: ${message}`)
        if(!name) return res.status(400).json({ message: 'O Nome se perdeu no caminho' });
        if(!message) return res.status(400).json({ message: 'A mensagem se perdeu no caminho' });

        try {
            const contact = contacts.find(({ name: contactName, isMyContact }) => contactName && isMyContact && contactName.toLowerCase() === pessoas[name]);
            console.log(contact)
            if(!contact) return res.status(400).json({ message: `Não encontrei ${name} nos contatos` });
            client.sendText(contact.id, message.charAt(0).toUpperCase() + message.slice(1));
            return res.status(204).end();
        }
        catch(ex) {
            console.error(ex.message);
            return res.status(500).end();
        }
    });

    app.get('/', (_req, res) => res.send('Ok'));

    app.listen(9091, _ => console.log('Rodando na porta 9091'));
}

wa.create({
    multiDevice: true,
    useChrome: true,
    sessionId: 'alexa',
}).then(start);

setInterval(() => {
    wa.create({
        multiDevice: true,
        sessionId: 'alexa',
    }).then(start);
}, 3600000);