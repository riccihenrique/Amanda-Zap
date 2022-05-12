const express = require('express');
const wa = require('@open-wa/wa-automate');

const app = express();

const pessoas = {
    'duda': 'mor 💙',
    'pai': 'pai',
    'mãe': 'mãe',
    'tenente lucas': 'tenente lucas',
    'zé': 'zé',
    'dona alice': 'dona alice',
    'mateus': 'matias',
    'pedro leite': 'pedro leite'
};

const start = (client) => {
    app.get('/sendmessage', async (req, res) => {
        const { name, message } = req.query;
        if(!name) return res.status(400).json({ message: 'O Nome se perdeu no caminho' });
        if(!message) return res.status(400).json({ message: 'A mensagem se perdeu no caminho' });

        try {
            const contacts = await client.getAllContacts();
            const contact = contacts.find(({ name: contactName }) => contactName && contactName.toLowerCase() === pessoas[name]);
            if(!contact) return res.status(400).json({ message: `Não encontrei ${name} nos contatos` });
            await client.sendText(contact.id, message.charAt(0).toUpperCase() + message.slice(1));
            return res.end();
        }
        catch(ex) {
            console.error(ex.message);
            return res.status(500).end();
        }
    });

    app.get('/', (_req, res) => res.send('Ok'));

    app.listen(9090, _ => console.log('Rodando na porta 9090'));
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