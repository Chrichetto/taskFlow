import database from "../database.js";

/*
 * PostgreSQL converte automaticamente:
 *
 * dataInizio   → datainizio
 * dataFine     → datafine
 * iDcategoria  → idcategoria
 *
 * Con gli alias restituiamo al frontend gli stessi nomi
 * che utilizzavi con MySQL.
 */
const SELECT_TASK = `
    SELECT
        id,
        nome,
        datainizio AS "dataInizio",
        datafine AS "dataFine",
        priorita,
        idcategoria AS "iDcategoria",
        completata
    FROM task
`;

export async function getTasks(req, res) {
    try {
        const risultato = await database.query(`
            ${SELECT_TASK}
            ORDER BY id ASC
        `);

        return res.status(200).json(risultato.rows);
    } catch (errore) {
        console.error("Errore getTasks:", errore);

        return res.status(500).json({
            errore: "Dati non ricevuti con successo!"
        });
    }
}

export async function getTaskById(req, res) {
    try {
        const id = req.taskId;

        const risultato = await database.query(
            `
                ${SELECT_TASK}
                WHERE id = $1
            `,
            [id]
        );

        const task = risultato.rows;

        if (task.length === 0) {
            return res.status(404).json({
                errore: "Nessuna task trovata!"
            });
        }

        return res.status(200).json(task);
    } catch (errore) {
        console.error("Errore getTaskById:", errore);

        return res.status(500).json({
            errore: "Errore lato server!"
        });
    }
}

export async function getTaskByName(req, res) {
    try {
        const nome = req.taskName;

        const risultato = await database.query(
            `
                ${SELECT_TASK}
                WHERE nome = $1
                ORDER BY id ASC
            `,
            [nome]
        );

        const task = risultato.rows;

        if (task.length === 0) {
            return res.status(404).json({
                errore: "Nessuna task trovata!"
            });
        }

        return res.status(200).json(task);
    } catch (errore) {
        console.error("Errore getTaskByName:", errore);

        return res.status(500).json({
            errore: "Errore lato server!"
        });
    }
}

export async function getTaskByDataInizio(req, res) {
    try {
        const data = req.taskData;

        const risultato = await database.query(
            `
                ${SELECT_TASK}
                WHERE datainizio = $1
                ORDER BY id ASC
            `,
            [data]
        );

        const task = risultato.rows;

        if (task.length === 0) {
            return res.status(404).json({
                errore: "Nessuna task trovata!"
            });
        }

        return res.status(200).json(task);
    } catch (errore) {
        console.error("Errore getTaskByDataInizio:", errore);

        return res.status(500).json({
            errore: "Errore lato server!"
        });
    }
}

export async function getTaskByDataFine(req, res) {
    try {
        const data = req.taskData;

        const risultato = await database.query(
            `
                ${SELECT_TASK}
                WHERE datafine = $1
                ORDER BY id ASC
            `,
            [data]
        );

        const task = risultato.rows;

        if (task.length === 0) {
            return res.status(404).json({
                errore: "Nessuna task trovata!"
            });
        }

        return res.status(200).json(task);
    } catch (errore) {
        console.error("Errore getTaskByDataFine:", errore);

        return res.status(500).json({
            errore: "Errore lato server!"
        });
    }
}

export async function getTaskByPriorita(req, res) {
    try {
        const priorita = req.taskPriorita;

        const risultato = await database.query(
            `
                ${SELECT_TASK}
                WHERE priorita = $1
                ORDER BY id ASC
            `,
            [priorita]
        );

        const task = risultato.rows;

        if (task.length === 0) {
            return res.status(404).json({
                errore: "Nessuna task trovata!"
            });
        }

        return res.status(200).json(task);
    } catch (errore) {
        console.error("Errore getTaskByPriorita:", errore);

        return res.status(500).json({
            errore: "Errore lato server!"
        });
    }
}

export async function getTaskByCompletata(req, res) {
    try {
        const completata = req.taskCompletata;

        const risultato = await database.query(
            `
                ${SELECT_TASK}
                WHERE completata = $1
                ORDER BY id ASC
            `,
            [completata]
        );

        const task = risultato.rows;

        if (task.length === 0) {
            return res.status(404).json({
                errore: "Nessuna task trovata!"
            });
        }

        return res.status(200).json(task);
    } catch (errore) {
        console.error("Errore getTaskByCompletata:", errore);

        return res.status(500).json({
            errore: "Errore lato server!"
        });
    }
}

export async function getTaskByCategoria(req, res) {
    try {
        const categoria = req.taskCategoria;

        const risultato = await database.query(
            `
                ${SELECT_TASK}
                WHERE idcategoria = $1
                ORDER BY id ASC
            `,
            [categoria]
        );

        const task = risultato.rows;

        if (task.length === 0) {
            return res.status(404).json({
                errore: "Nessuna task trovata per questa categoria!"
            });
        }

        return res.status(200).json(task);
    } catch (errore) {
        console.error("Errore getTaskByCategoria:", errore);

        return res.status(500).json({
            errore: "Errore lato server!"
        });
    }
}

export async function getCategoria(req, res) {
    try {
        /*
         * Controlla il tuo middleware validaCategoria.
         *
         * Se salva il nome in req.taskCategoria, questa riga è corretta.
         * Se invece usa req.taskName, sostituiscila con:
         *
         * const nome = req.taskName;
         */
        const nome = req.taskCategoria;

        const risultato = await database.query(
            `
                SELECT id, nome
                FROM categorie
                WHERE nome = $1
                ORDER BY id ASC
            `,
            [nome]
        );

        const categorie = risultato.rows;

        if (categorie.length === 0) {
            return res.status(404).json({
                errore: "Nessuna categoria trovata!"
            });
        }

        return res.status(200).json(categorie);
    } catch (errore) {
        console.error("Errore getCategoria:", errore);

        return res.status(500).json({
            errore: "Errore lato server!"
        });
    }
}

export async function getCategoriaId(req, res) {
    try {
        const id = req.taskId;

        const risultato = await database.query(
            `
                SELECT id, nome
                FROM categorie
                WHERE id = $1
            `,
            [id]
        );

        const categorie = risultato.rows;

        if (categorie.length === 0) {
            return res.status(404).json({
                errore: "Nessuna categoria trovata!"
            });
        }

        return res.status(200).json(categorie);
    } catch (errore) {
        console.error("Errore getCategoriaId:", errore);

        return res.status(500).json({
            errore: "Errore lato server!"
        });
    }
}

export async function getCategorie(req, res) {
    try {
        const risultato = await database.query(
            `
                SELECT id, nome
                FROM categorie
                ORDER BY nome ASC
            `
        );

        return res.status(200).json(risultato.rows);

    } catch (errore) {
        console.error("Errore getCategorie:", errore);

        return res.status(500).json({
            errore: "Impossibile recuperare le categorie!"
        });
    }
}
