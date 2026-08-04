import database from "../database.js";

export async function deleteTask(req, res) {
    try {
        const id = req.taskId;

        const risultato = await database.query(
            `
                DELETE FROM task
                WHERE id = $1
                RETURNING id
            `,
            [id]
        );

        if (risultato.rows.length === 0) {
            return res.status(404).json({
                errore: "Task non trovata!"
            });
        }

        return res.status(200).json({
            messaggio: "Task cancellata",
            id: risultato.rows[0].id
        });

    } catch (errore) {
        console.error("Errore deleteTask:", errore);

        return res.status(500).json({
            errore: "Errore lato server!"
        });
    }
}

export async function deleteCategoria(req, res) {
    try {
        const id = req.taskId;

        const risultato = await database.query(
            `
                DELETE FROM categorie
                WHERE id = $1
                RETURNING id
            `,
            [id]
        );

        if (risultato.rows.length === 0) {
            return res.status(404).json({
                errore: "Categoria non trovata!"
            });
        }

        return res.status(200).json({
            messaggio: "Categoria cancellata",
            id: risultato.rows[0].id
        });

    } catch (errore) {
        console.error("Errore deleteCategoria:", errore);

        if (errore.code === "23503") {
            return res.status(409).json({
                errore: "Non puoi cancellare questa categoria perché è ancora utilizzata da una o più task."
            });
        }

        return res.status(500).json({
            errore: "Errore lato server!"
        });
    }
}