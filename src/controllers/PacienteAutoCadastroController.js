import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default {
  async criaPaciente(req, res) {
    try {
      const {
        nome,
        cpf,
        aniversario,
        estado,
        email,
        telefone,
        senha,
        confirmacaoSenha,
      } = req.body;

      let paciente = await prisma.paciente.findUnique({
        where: { cpf: cpf },
      });

      if (paciente) {
        return res.send({
          error: `Já existe um médico com esses dados! ${cpf}`,
        });
      }

      paciente = await prisma.paciente.create({
        data: {
          nome,
          cpf,
          aniversario,
          estado,
          email,
          telefone,
          senha,
          confirmacaoSenha,
        },
      });
      return res.json(paciente);
    } catch (error) {
      return res.send(`Problema ao cadastrar usuário: ${error}`);
    }
  },
  async findAllPacientes(req, res) {
    try {
      const pacientes = await prisma.paciente.findMany();
      return res.json(pacientes);
    } catch (error) {
      return res.send({ error });
    }
  },

  async findPaciente(req, res) {
    try {
      const { id } = req.params;
      const paciente = await prisma.paciente.findUnique({
        where: { id: Number(id) },
      });

      if (!paciente)
        return res.send({
          error: 'Não há médico cadastrado com esse ID!',
        });

      return res.json(paciente);
    } catch (error) {
      return res.send({ error });
    }
  },
  async updatePaciente(req, res) {
    try {
      const { id } = req.params;

      const {
        nome,
        cpf,
        aniversario,
        estado,
        email,
        telefone,
        senha,
        confirmacaoSenha,
      } = req.body;

      let paciente = await prisma.paciente.findUnique({
        where: { id: Number(id) },
      });

      if (!paciente)
        return res.send({
          error: 'Não há médico cadastrado com esse ID!',
        });

      paciente = await prisma.paciente.update({
        where: { id: Number(id) },
        data: {
          id,
          nome,
          cpf,
          aniversario,
          estado,
          email,
          telefone,
          senha,
          confirmacaoSenha,
        },
      });
      return res.json(paciente);
    } catch (error) {
      return res.json({ error });
    }
  },
  async deletePaciente(req, res) {
    try {
      const { id } = req.params;
      const paciente = await prisma.paciente.findUnique({
        where: { id: Number(id) },
      });

      if (!paciente)
        return res.send({
          error: 'Não há médico cadastrado com esse ID!',
        });

      await prisma.paciente.delete({ where: { id: Number(id) } });

      return res.send({ message: 'Usuário deletado!' });
    } catch (error) {
      return res.send({ error });
    }
  },
};