const WebSocket = require('ws');
const qs = require('qs');
const url = require('url');
const MongoClient = require('mongodb').MongoClient;

let db;

const ws = new WebSocket.Server({
    port: 3001
});

clients = {}

MongoClient.connect(`mongodb://127.0.0.1:27017`, {poolSize:20}, (err, costumer) => {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log(`Runnung on port: ${ws.options.port}`);
    }
    

    db = costumer.db('chat');
    let chat = db.collection('messages');
    // console.log('dis faq'+chat);

    ws.on('connection', (socket, request) => {
        
        const params = qs.parse(url.parse(request.url).query);
        clients[params.key] = socket;
        clients[params.key].isAlive = true;
        clients[params.key].on('pong', () => {
            clients[params.key].isAlive = true;
        });
        let user = String(params.key);
        let oldMessages =[];
        chat.find({ $or: [ {'usr':user}, {'to': 'all'}, {'to': user} ] }).limit(100).toArray( function(err, result) {
            if (err) throw err;
            oldMessages = result;
            console.log(user + ' has joined');
            for (let i = 0; i < oldMessages.length; i++) {
                let msg = oldMessages[i];
                let message = JSON.stringify(oldMessages[i]);
                if (msg.type === 'message') {
                    // console.log(message);
                    clients[user].send(message);
                }
            }    
        });
        
        clientsArray ={type: 'join', arr: Object.keys(clients)}
        ws.clients.forEach(client =>{
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(clientsArray));
            }
        });

        // console.log(clients)

        socket.on('message', message => {
            let msg = JSON.parse(message);
            msg.date = new Date;
            console.log(msg);
            console.log('inserted msg')
            if (msg.to === "all") {
                chat.insertOne(msg);
                ws.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN) {
                        
                        if (msg.type === 'message') {
                            // console.log(message);
                            client.send(message);
                        }
                    }
                });
            }
            if (msg.to !== 'all') {
                if (clients[msg.to]) {
                    
                
                    if (clients[msg.to].readyState === WebSocket.OPEN) {
                        chat.insertOne(msg);   
                        if (msg.type === 'message') {
                            // console.log(message);
                            // console.log(Object.keys(clients));
                            clients[msg.usr].send(message);
                            clients[msg.to].send(message);
                            // console.log(clients);
                        }
                    }
                }
            }
        });
    });
});
setInterval(() => {
    Object.keys(clients).forEach(client => {
        if (clients[client].isAlive == false) {
            
            delete clients[client];
            let offlineclient = client
            ws.clients.forEach(client =>{
                if (client.readyState === WebSocket.OPEN) {
                    deleteClient={type:'remove', usr: offlineclient};
                    client.send(JSON.stringify(deleteClient));
                    console.log(offlineclient + ' has left');
                }
            });
        }else{
            // console.log(client + ' being alive is ' + clients[client].isAlive);
            clients[client].isAlive = 0;
            clients[client].ping();
        }
    })
}, 1000);
