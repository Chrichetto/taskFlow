import database from "../database.js";

export async function createTask(req, res){
    try{
        const {nome, dataInizio, dataFine, priorita, iDcategoria, completata} = req.body;

        const [risultato] = await database.query(
            "INSERT INTO task(nome, dataInizio, dataFine, priorita, iDcategoria, completata) VALUES(?,?,?,?,?,?)",
            [nome, dataInizio, dataFine, priorita, iDcategoria, completata]
        );

        if(risultato.affectedRows === 0){
            return res.status(404).json({
                errore: "Task non aggiunta!"
            });
        }

        return res.status(201).json({
            messaggio: "Task Creata con Successo!",
            id: risultato.insertId,
            nome
        });
    }catch(errore){
        console.log(errore);

        res.status(500).json({
            errore: "Errore con i dati nel server"
        });
    }
}

export async function createCategoria(req, res){
    try{
        const {nome} = req.body;

        const [risultato] = await database.query(
            "INSERT INTO Categorie(nome) VALUES(?)",
            [nome]
        );

        if(risultato.affectedRows === 0){
            return res.status(404).json({
                errore: "Task non aggiunta!"
            });
        }

        return res.status(201).json({
            messaggio: "Task Creata con Successo!",
            id: risultato.insertId,
            nome
        });
    }catch(errore){
        console.log(errore);

        res.status(500).json({
            errore: "Errore con i dati nel server"
        });
    }
}