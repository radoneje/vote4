const Gateway = require('micromq/gateway');

// создаем гейтвей
const gateway = new Gateway({
    microservices: ['market'],
    rabbit: {
        url: "amqp://guest:guest@localhost:5672"
    },
});

// создаем эндпоинт и делегируем его в микросервис market
gateway.post('/market/buy/:id', (req, res) => {res.delegate('market')
res.json(1)
});

// слушаем порт и принимаем запросы
gateway.listen(7002);
