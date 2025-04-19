const User = require('../models');
const SharedAccess = require('../models/SharedAccess');

async function compartilharAcesso(req, res) {
    const { email } = req.body;
    const ownerId = req.userId;

    try {
        // Verifica se o email pertece a um usuario existente
        const destinatario = await User.findOne({ where: { email }});

        if (!destinatario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (destinatario.id === ownerId) {
            return res.status(500).json({ message: 'Você não pode compartilhar consigo mesmo' });
        }

        // verifica se já existe um compartilhamento
        const jaExiste = await SharedAccess.findOne({
            where: {
                ownerId,
                sharedWithId: destinatario.id
            }
        });

        if (jaExiste) {
            return res.status(400).json({ message: 'Acesso já compartilhado com este usuário' });
        }

        // Cria um compartilhamento
        await SharedAccess.create({
            ownerId,
            sharedWithId: destinatario.id
        });

        res.status(200).json({ message: 'Acesso compartilhado com sucesso' });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Erro ao compartilhar acesso' });
    }
}

module.exports = { compartilharAcesso };