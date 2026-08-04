import database from "../database.js";

export async function updateTask(req, res) {
    try {
        const {
            nome,
            dataInizio,
            dataFine,
            priorita,
            iDcategoria,
            completata,
            idVecchiaTask
        } = req.body;

        const risultato = await database.query(
            `
                UPDATE task
                SET
                    nome = $1,
                    datainizio = $2,
                    datafine = $3,
                    priorita = $4,
                    idcategoria = $5,
                    completata = $6
                WHERE id = $7
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
                completata,
                idVecchiaTask
            ]
        );

        if (risultato.rows.length === 0) {
            return res.status(404).json({
                errore: "Task non trovata"
            });
        }

        const taskAggiornata = risultato.rows[0];

        return res.status(200).json({
            messaggio: "Task aggiornata con successo",
            id: taskAggiornata.id,
            task: taskAggiornata
        });

    } catch (errore) {
        console.error("Errore updateTask:", errore);

        if (errore.code === "23503") {
            return res.status(400).json({
                errore: "La categoria selezionata non esiste."
            });
        }

        return res.status(500).json({
            errore: "Errore lato server!"
        });
    }
}

export async function updateCategoria(req, res) {
    try {
        const {
            nome,
            idVecchiaCategoria
        } = req.body;

        const risultato = await database.query(
            `
                UPDATE categorie
                SET nome = $1
                WHERE id = $2
                RETURNING id, nome
            `,
            [
                nome,
                idVecchiaCategoria
            ]
        );

        if (risultato.rows.length === 0) {
            return res.status(404).json({
                errore: "Categoria non trovata"
            });
        }

        const categoriaAggiornata = risultato.rows[0];

        return res.status(200).json({
            messaggio: "Categoria aggiornata con successo",
            id: categoriaAggiornata.id,
            categoria: categoriaAggiornata
        });

    } catch (errore) {
        console.error("Errore updateCategoria:", errore);

        return res.status(500).json({
            errore: "Errore lato server!"
        });
    }
}