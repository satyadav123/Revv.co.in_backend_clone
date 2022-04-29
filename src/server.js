const app = require("./index");
const connect = require("./configs/db");
const port = process.env.PORT || 5656;
app.listen(port, async () => {
    try{
        await connect();
        console.log(`listening on port ${port}`)
    }
    catch(err){
        console.log(err.message);
    }
}); 