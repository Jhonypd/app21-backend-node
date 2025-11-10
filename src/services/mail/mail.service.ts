import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Renderizar template EJS
  private async renderTemplate(
    templateName: string,
    data: any
  ): Promise<string> {
    const templatePath = path.join(
      __dirname,
      "../mail/views",
      `${templateName}.ejs`
    );
    return new Promise((resolve, reject) => {
      ejs.renderFile(templatePath, data, (err, html) => {
        if (err) reject(err);
        else resolve(html);
      });
    });
  }

  // Método genérico para enviar email
  async sendEmail(to: string, subject: string, html: string, text?: string) {
    try {
      const mailOptions = {
        from: `"App21" <${process.env.SMTP_FROM}>`,
        to,
        subject,
        text: text || subject,
        html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      return result;
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      throw error;
    }
  }

  // Email de confirmação de conta
  async sendEmailConfirmaConta(
    user: {
      nome: string;
      email: string;
    },
    linkConfirmacao: string
  ) {
    const html = await this.renderTemplate("email-confirmar-conta", {
      nome: user.nome,
      ano: new Date().getFullYear(),
      linkConfirmacao: linkConfirmacao,
    });

    return this.sendEmail(user.email, "Confirmação de Conta", html);
  }
  // Email de confirmação de alteração de e-mail
  async sendEmailConfirmaAlteracao(
    user: {
      nome: string;
      email: string;
    },
    linkConfirmacao: string
  ) {
    const html = await this.renderTemplate("email-confirmar", {
      nome: user.nome,
      email: user.email,
      ano: new Date().getFullYear(),
      linkConfirmacao: linkConfirmacao,
    });

    return this.sendEmail(
      user.email,
      "Confirmação de Alteração de E-mail - App21",
      html
    );
  }

  // Email de recuperação de senha
  async sendEmailRecuperacaoSenha(
    user: { nome: string; email: string },
    linkResetSenha: string
  ) {
    const html = await this.renderTemplate("email-recuperar-senha", {
      nome: user.nome,
      linkResetSenha,
      ano: new Date().getFullYear(),
    });

    return this.sendEmail(user.email, "Recuperação de Senha - App21", html);
  }

  // Email de convite para sala
  async sendEmailConviteSala(
    user: { nome: string; email: string },
    sala: { nome: string },
    inviter: string
  ) {
    const roomLink = `${process.env.FRONTEND_URL}/salas/join`;

    const html = await this.renderTemplate("room-invite", {
      nome: user.nome,
      salaNome: sala.nome,
      inviterNome: inviter,
      roomLink,
    });

    return this.sendEmail(
      user.email,
      `Convite para a sala: ${sala.nome}`,
      html
    );
  }
}

export default new EmailService();
