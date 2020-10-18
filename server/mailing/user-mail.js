const mailgun = require("mailgun-js");
const DOMAIN = 'https://api.mailgun.net/v3/mailing.umana.co';
const mg = new mailgun({apiKey: '9aff0f3110be15bd2e80a21ccef0583c-2fbe671d-b49e912a', domain: DOMAIN});

const sendMailTest = (req, h) => {
	const data = {
		from: 'Registro de usuario <noreply@mailing.umana.co>',
		to: 'jorge@royalestudios.com',
		subject: 'Nuevo usuario',
		text: 'Estas son tus credenciales'
	};
	mg.messages().send(data, function (error, body) {
		console.log('Body email message:', body);
	});
	
	return h.response(true)
}

module.exports = {
	sendMailTest
}

// curl -s --user 'api:9aff0f3110be15bd2e80a21ccef0583c-2fbe671d-b49e912a' \
//     https://api.mailgun.net/v3/mailing.umana.co/messages \
// 	    -F from='Excited User <noreply@mailing.umana.co>' \
//     -F to=jorge@royalestudios.com \
//     -F to=jorge.alberto.rojas.solorzano@gmail.com \
//     -F subject='Hello' \
//     -F text='Hola desde mailgun!'