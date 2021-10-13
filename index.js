const express = require('express');
const wa = require('@open-wa/wa-automate');

const app = express();
let client = {};

const pessoas = {
    duda: 'Mor 💙',
};

wa.create().then(cli => {
    client = cli;
});

app.get('/sendmessage', async (req, res) => {
    const { name, message } = req.query;
    if(!name) res.status(400).json({ message: 'Nome não reconhecido' });
    if(!message) res.status(400).json({ message: 'Mensagem não reconhecida' });

    const contacts = await client.getAllContacts();
    const contact = contacts.filter(({ name: contactName }) => contactName && contactName === (pessoas[name] || name))[0];
    console.log(pessoas[name], name, contact);
    if(!contact) res.status(400).json({ message: 'Contato não encontrado' });
    // await client.sendText(contact.id, message);
    res.end();
});

app.listen(9090, _ => console.log('Rodando na porta 9090'))