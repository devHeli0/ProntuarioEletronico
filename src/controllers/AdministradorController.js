import { PrismaClient } from '@prisma/client';
import GeraCPF from '../scripts/GeraCPF';
const prisma = new PrismaClient();

export default {
  async criaAdm(req, res) {
    try {
      const gera = new GeraCPF();
      let cpfGerado = gera.geraNovoCpf();
      const senha = Math.random().toString(36).slice(-6);
      const superUser = await prisma.administrador.create({
        select: {
          cpf: true,
          senha: true,
        },
        data: {
          cpf: cpfGerado,
          senha,
        },
      });
      return res.json(superUser);
    } catch (error) {
      return res.send({ error: error.message });
    }
  },
  //#######Medico
  async ativaMedico(req, res) {
    const { id } = req.params;
    try {
      const medico = await prisma.medico.update({
        where: { id: parseInt(id) },
        data: { isActive: true },
      });
      if (medico.isActive === true) {
        res.send(`Paciente ativado com sucesso!`);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async inativaMedico(req, res) {
    const { id } = req.params;
    try {
      const medico = await prisma.medico.update({
        where: { id: parseInt(id) },
        data: { isActive: false },
      });
      if (medico.isActive === false) {
        res.send(`Paciente inativado com sucesso!`);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
  //#######Paciente
  async ativaPaciente(req, res) {
    const { id } = req.params;
    try {
      const paciente = await prisma.paciente.update({
        where: { id: parseInt(id) },
        data: { isActive: true },
      });
      if (paciente.isActive === true) {
        res.send(`Paciente ativado com sucesso!`);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async inativaPaciente(req, res) {
    const { id } = req.params;
    try {
      const paciente = await prisma.paciente.update({
        where: { id: parseInt(id) },
        data: { isActive: false },
      });

      if (paciente.isActive === false) {
        res.send(`Paciente inativado com sucesso!`);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async transparencia(req, res) {
    try {
      const medicos = await prisma.medico.findMany();
      const pacientes = await prisma.paciente.findMany();
      const meusPacientes = await prisma.meuPaciente.findMany();
      let ativos = 0;
      let inativos = 0;

      for (let i = 0; i <= medicos.length; i++) {
        medicos.isActive === true ? ativos++ : inativos++;
      }

      return res.json({
        medicos: medicos.length,
        pacientesAutoCadastro: pacientes.length,
        pacientesCadastradosPorMedicos: meusPacientes.length,
        medicosAtivos: ativos,
        pacientesInativos: inativos,
      });
    } catch (error) {
      res.send(error);
    }
  },
};
