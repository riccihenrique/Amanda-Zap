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
};

const start = (client) => {
    app.get('/sendmessage', async (req, res) => {
        const { name, message } = req.query;
        if(!name) res.status(400).json({ message: 'Nome não reconhecido' });
        if(!message) res.status(400).json({ message: 'Mensagem não reconhecida' });

        try {
            const contacts = await client.getAllContacts();
            const contact = contacts.filter(({ name: contactName }) => contactName && contactName.toLowerCase() === pessoas[name])[0];
            if(!contact) res.status(400).json({ message: 'Contato não encontrado' });
            await client.sendText(contact.id, message);
            res.end();
        }
        catch(ex) {
            console.error(ex.message);
            res.status(500).end();
        }
    });

    app.get('/', (req, res) => res.send('Ok'));

    app.listen(9090, _ => console.log('Rodando na porta 9090'));
}

setInterval(() => {
    wa.create({
        multiDevice: true,
        sessionId: 'alexa',
    }).then(start);
}, 3600000);