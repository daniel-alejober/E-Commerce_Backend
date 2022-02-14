const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'});

const conectarDB = async()=>{
    try {
        /*el connect toma como 
        primer parametro la url a donde se va a conectar 
        segundo un objeto de configuracion */
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log('Conexion exitosa')
        
    } catch (error) {
        console.log(error);
        process.exit(1);//Detiene la app en caso de llegar a tener un error de conexion
    }
}

module.exports = conectarDB;