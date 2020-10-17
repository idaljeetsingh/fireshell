const { databaseQuery } = require('./database');
const { firestoreQuery } = require('./firestore');

function processQuery(input, db = require('../config.json').db){
    let output;
    if(db == 'database'){
        output = databaseQuery(input);

        if(output instanceof Error){
            return output;
        } else {
            return output.then(data => {
                if (data === undefined){
                    return "Query execution successful.";
                } else {
                    return data.val();
                }
            });
        }
    } else {
        output = firestoreQuery(input);
        if(output instanceof Error){
            return output;
        } else {
            return output.then(data => {
                if(data === undefined){
                    return "Query execution successful."
                } else if(data.data === undefined){
                    if(data.empty){
                        return 'No documents found';
                    } else {
                        let obj = {};
                        data.forEach((doc) => {
                            obj[doc.id] = doc.data();
                        });
                        return obj;
                    }
                } else {
                    return data.data();
                }
            });
        }
    }
}

processQuery('db.ref().child("posts").child("node js").set({ "author": "Aayush Kurup", "metrics": { "likes": 12123, "shares": 9881, "views": 1299812 }, "title": "An Introduction to Node js"})', 'database').then(data => {
    console.log(data);
});


module.exports = {
    processQuery
}