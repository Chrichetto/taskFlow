import database from "../database.js";

export async function createTask(req, res) {
    try {
        const {
            nome,
            dataInizio,
            dataFine,
            priorita,
            iDcategoria,
            completata
        } = req.body;

        const risultato = await database.query(
            `
                INSERT INTO task (
                    nome,
                    datainizio,
                    datafine,
                    priorita,
                    idcategoria,
                    completata
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING
                    id,
                    nome,
                    datainizio AS "dataInizio",
                    datafine AS "dataFine",
                    priorita,
                    idcategoria AS "iDcategoria",
                    completata
            `,
            [
                nome,
                dataInizio,
                dataFine,
                priorita,
                iDcategoria,
                completata
            ]
        );

        const taskCreata = risultato.rows[0];

        return res.status(201).json({
            messaggio: "Task creata con successo!",
            id: taskCreata.id,
            task: taskCreata
        });

    } catch (errore) {
        console.error("Errore createTask:", errore);

        if (errore.code === "23503") {
            return res.status(400).json({
                errore: "La categoria selezionata non esiste."
            });
        }

        return res.status(500).json({
            errore: "Errore con i dati nel server"
        });
    }
}

export async function createCategoria(req, res) {
    try {
        const { nome } = req.body;

        const risultato = await database.query(
            `
                INSERT INTO categorie (nome)
                VALUES ($1)
                RETURNING id, nome
            `,
            [nome]
        );

        const categoriaCreata = risultato.rows[0];

        return res.status(201).json({
            messaggio: "Categoria creata con successo!",
            id: categoriaCreata.id,
            categoria: categoriaCreata
        });

    } catch (errore) {
        console.error("Errore createCategoria:", errore);

        return res.status(500).json({
            errore: "Errore con i dati nel server"
        });
    }
}