import { Request, Response } from 'express'
import nodemailer from 'nodemailer'

function sendmail(email: string, assunto: string, html: string) {

    var transporter = nodemailer.createTransport({
        pool: true,
        host: "smtp.kinghost.net",
        port: 465,
        secure: true, // use TLS
        auth: {
            user: "faleconosco.envio@urbam.com.br",
            pass: "urb@2021FC",
        },
    });

    var mailOptions = {
        from: "Equipe Dev da Urbam <nao-responda@urbam.com.br>",
        to: email,
        subject: assunto,
        text: html,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

const EmailController = {
    enviaEmail: (req: Request, res: Response) => {
        try {
            sendmail(req.body.email, req.body.titulo, req.body.sugestao)
            res.status(200).json({
                message: "Email enviado com suceso"
            })
        } catch (e) {
            console.log(e);
            return res.status(400).json({
                message: "Erro" + e
            })
        }
    }
}

export { EmailController };

