const mailgun = require('mailgun-js')({
	apiKey: 'key-XXXXXXXXXXXXXXXXXXXXX',
	domain: 'cadenza.tech'
});

var data = {
    from: 'PD User <dev@predator-digital.com>',
    to: 'harish.kashaboina@predator-digital.com',
    subject: 'Hello',
    text: 'Testing some Mailgun awesomeness!'
  };
   
  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  });