import database from "../database.js";

export async function getTasks(req, res){
    try{
        const [risultato] = await database.query(
            "SELECT * FROM Task"
        );
        return res.status(200).json(risultato);
    }catch(errore){
        console.log(errore);

        res.status(500).json({
            errore: "Dati non ricevuti con successo!"
        });
    }
};

export async function getTaskById(req, res){
    try{
        const id = req.taskId;
        const [task] = await database.query(
            "SELECT * FROM task WHERE id = ?",
            [id]
        );

        if(task.length === 0){
            return res.status(404).json({
                errore: "Nessuna Task Trovata!"
            });
        }

        res.status(200).json(task);
    }catch(errore){
        console.log(errore);

        res.status(500).json({
            errore: "Errore lato server!"
        });
    }
};

export async function getTaskByName(req, res){
    try{
        const nome = req.taskName;
        const [task] = await database.query(
            "SELECT * FROM task WHERE nome = ?",
            [nome]
        );

        if(task.length === 0){
            return res.status(404).json({
                errore: "Nessuna Task Trovata!"
            });
        }

        res.status(200).json(task);
    }catch(errore){
        console.log(errore);

        res.status(500).json({
            errore: "Errore lato server!"
        });
    }
}

export async function getTaskByDataInizio(req, res){
    try{
        const data = req.taskData;
        const [task] = await database.query(
            "SELECT * FROM task WHERE dataInizio = ?",
            [data]
        );

        if(task.length === 0){
            return res.status(404).json({
                errore: "Nessuna Task Trovata!"
            });
        }

        res.status(200).json(task);
    }catch(errore){
        console.log(errore);

        res.status(500).json({
            errore: "Errore lato server!"
        });
    }
}

export async function getTaskByDataFine(req, res){
    try{
        const data = req.taskData;
        const [task] = await database.query(
            "SELECT * FROM task WHERE dataFine = ?",
            [data]
        );

        if(task.length === 0){
            return res.status(404).json({
                errore: "Nessuna Task Trovata!"
            });
        }

        res.status(200).json(task);
    }catch(errore){
        console.log(errore);

        res.status(500).json({
            errore: "Errore lato server!"
        });
    }
}


export async function getTaskByPriorita(req, res){
    try{
        const priorita = req.taskPriorita;
        const [task] = await database.query(
            "SELECT * FROM task WHERE priorita = ?",
            [priorita]
        );

        if(task.length === 0){
            return res.status(404).json({
                errore: "Nessuna Task Trovata!"
            });
        }

        res.status(200).json(task);
    }catch(errore){
        console.log(errore);

        res.status(500).json({
            errore: "Errore lato server!"
        });
    }
};

export async function getTaskByCompletata(req, res){
    try{
        const completata = req.taskCompletata;
        const [task] = await database.query(
            "SELECT * FROM task WHERE completata = ?",
            [completata]
        );

        if(task.length === 0){
            return res.status(404).json({
                errore: "Nessuna Task Trovata!"
            });
        }

        res.status(200).json(task);
    }catch(errore){
        console.log(errore);

        res.status(500).json({
            errore: "Errore lato server!"
        });
    }
};

export async function getTaskByCategoria(req, res){
    try{
        const categoria = req.taskCategoria;
        const [task] = await database.query(
            "SELECT * FROM task WHERE categoria = ?",
            [categoria]
        );

        if(task.length === 0){
            return res.status(404).json({
                errore: "Nessuna Task Trovata!"
            });
        }

        res.status(200).json(task);
    }catch(errore){
        console.log(errore);

        res.status(500).json({
            errore: "Errore lato server!"
        });
    }
};

export async function getCategoria(req, res){
    try{
        const nome = req.taskName;
        const [task] = await database.query(
            "SELECT * FROM categorie WHERE nome = ?",
            [nome]
        );

        if(task.length === 0){
            return res.status(404).json({
                errore: "Nessuna Task Trovata!"
            });
        }

        res.status(200).json(task);
    }catch(errore){
        console.log(errore);

        res.status(500).json({
            errore: "Errore lato server!"
        });
    }
};


export async function getCategoriaId(req, res){
    try{
        const id = req.taskId;
        const [task] = await database.query(
            "SELECT * FROM categorie WHERE id = ?",
            [id]
        );

        if(task.length === 0){
            return res.status(404).json({
                errore: "Nessuna Categoria Trovata!"
            });
        }

        res.status(200).json(task);
    }catch(errore){
        console.log(errore);

        res.status(500).json({
            errore: "Errore lato server!"
        });
    }
};