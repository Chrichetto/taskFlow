import database from "../database.js";

export async function updateTask(req, res){
    try{
        const {nome, dataInizio, dataFine, priorita, iDcategoria, completata, idVecchiaTask} = req.body;

        const [aggiornamento] = await database.query(
            "UPDATE task SET nome = ?, dataInizio = ?, dataFine = ?, priorita = ?, iDcategoria = ?, completata = ? WHERE id = ?",
            [nome, dataInizio, dataFine, priorita, iDcategoria, completata, idVecchiaTask]
        );

        if(aggiornamento.affectedRows === 0){
            return res.status(404).json({
                errore: "Task non trovata"
            });
        }

        return res.status(200).json({
            messaggio: "Task Aggiornata con successo",
            id: idVecchiaTask
        });

    }catch(errore){
        console.log(errore);

        res.status(500).json({
            errore: "Errore Lato Server!"
        });
    }
};

export async function updateCategoria(req, res){
    try{
        const {nome, idVecchiaCategoria} = req.body;

        const [aggiornamento] = await database.query(
            "UPDATE Categorie SET nome = ? WHERE id = ?",
            [nome, idVecchiaCategoria]
        );

        if(aggiornamento.affectedRows === 0){
            return res.status(404).json({
                errore: "Task non trovata"
            });
        }

        return res.status(200).json({
            messaggio: "Task Aggiornata con successo",
            id: idVecchiaCategoria
        });

    }catch(errore){
        console.log(errore);

        res.status(500).json({
            errore: "Errore Lato Server!"
        });
    }
};