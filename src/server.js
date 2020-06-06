const express = require("express")
const server = express()
//pegando o banco de dados
const db = require("./database/db")
//configurar pasta public
server.use(express.static("public"))
//habilitar o uso do req.body na nossa aplicaçao
server.use(express.urlencoded({extended:true}))
//utilizando template enfine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})
//configurar caminhos da aplicaçao
//pagina inicial
//req: requisiçao
//res: resposta
server.get("/", (req, res)=>{
    return res.render("index.html", {
        title: "Um titulo",
    })
})
server.get("/create-point", (req, res)=>{
    //req query: query strings da nossa url(dados q ficam na url)
    //console.log(req.query)


    return res.render("create-point.html")
})
server.post("/savepoint", (req, res)=>{
    //req.body: corpo do formulario
    // console.log(req.body)

    //inserir dados no banco de dados inserir dados na tabela
    const query = `
    INSERT INTO places (
        image,
        name,
        address,
        address2,
        state,
        city,
        items
    ) VALUES (?,?,?,?,?,?,?);
`
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if(err) {
            console.log(err)
            return res.send("Erro no cadastro!")
        }
        console.log("Cadastrado com sucesso")
        console.log(this)
        return res.render("create-point.html", { saved: true })
        }
    db.run(query, values, afterInsertData)


 
})


server.get("/search", (req, res)=>{
    const search = req.query.search
    if(search == "") {
        //pesquisa vazia
         //mostrar a pagina html com os dados do bd
         return res.render("search-results.html", { total: 0})
    }

    //fazendo consulta ao banco de dados para listar
    // O LIKE COM AS % faz com q pesquisa palavras q começem ou depois com o que foi digitado
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
        if(err) {
           return console.log(err)
        }
        const total = rows.length
 
        //mostrar a pagina html com os dados do bd
        return res.render("search-results.html", { places: rows, total})
    })
    
})

//ligar o servidor
server.listen(3000)