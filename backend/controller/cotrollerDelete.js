import database from "../database.js";

export async function deleteTask(req, res){
    try{
        const id = req.taskId;

        const [cancella] = await database.query(
            "DELETE FROM Task WHERE id = ?",
            [id]
        );

        if(cancella.affectedRows === 0){
            return res.status(404).json({
                errore: "Task Non cancellata!"
            });
        };

        return res.status(200).json({
            messaggio: "Task cancellata",
            id: id
        });
    }catch(errore){
        console.log(errore);

        res.status(500).json({
            errore: "Errore lato server!"
        });
    }
};

export async function deleteCategoria(req, res){
    try{
        const id = req.taskId;

        const [cancella] = await database.query(
            "DELETE FROM Categorie WHERE id = ?",
            [id]
        );

        if(cancella.affectedRows === 0){
            return res.status(404).json({
                errore: "Categoria Non cancellata!"
            });
        };

        return res.status(200).json({
            messaggio: "Categoria cancellata",
            id: id
        });
    }catch(errore){
        console.log(errore);

        res.status(500).json({
            errore: "Errore lato server!"
        });
    }
}