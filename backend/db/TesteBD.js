
const sql = require('mssql');
const config = require('./DBConnection'); // Importa o arquivo de configuração

async function testConnection() {
    try {
        // Tenta conectar ao SQL Server
        await sql.connect(config);
        console.log('Conectado ao SQL Server!');
        
        // Realiza uma consulta de teste (opcional)
        const result = await sql.query('SELECT @@SERVERNAME AS NomeDoServidor');
        console.log('Nome do servidor:', result.recordset[0].NomeDoServidor);

    } catch (error) {
        console.error('Erro ao conectar ao SQL Server:', error);
    } finally {
        // Fecha a conexão após o teste
        sql.close();
    }
}

testConnection();