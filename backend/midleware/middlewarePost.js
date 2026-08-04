import database from "../database.js";

export function validaNomeP(req, res, next) {
    const nome = req.body.nome;

    if (
        typeof nome !== "string" ||
        nome.trim().length === 0
    ) {
        return res.status(400).json({
            errore: "Il nome non è valido!"
        });
    }

    req.body.nome = nome.trim();

    next();
}

function isValidSQLDate(dateString) {
    if (typeof dateString !== "string") {
        return false;
    }

    const regex =
        /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

    if (!regex.test(dateString)) {
        return false;
    }

    const [year, month, day] =
        dateString.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

export function valdiaDataP(req, res, next) {
    const { dataInizio, dataFine } = req.body;

    if (
        !isValidSQLDate(dataInizio) ||
        !isValidSQLDate(dataFine)
    ) {
        return res.status(400).json({
            errore: "La data di inizio o di fine non è valida!"
        });
    }

    if (dataFine < dataInizio) {
        return res.status(400).json({
            errore: "La data di fine non può precedere la data di inizio!"
        });
    }

    next();
}

export function valdiaPrioritaP(req, res, next) {
    const priorita = Number(req.body.priorita);

    if (
        !Number.isInteger(priorita) ||
        priorita < 0 ||
        priorita > 5
    ) {
        return res.status(400).json({
            errore: "La priorità deve essere un numero compreso tra 0 e 5!"
        });
    }

    req.body.priorita = priorita;

    next();
}

export function valdiaCompletataP(req, res, next) {
    const completata = req.body.completata;

    if (typeof completata !== "boolean") {
        return res.status(400).json({
            errore: "Il campo completata deve essere true oppure false!"
        });
    }

    next();
}

export async function validaCategoriaP(req, res, next) {
    try {
        const categoria = Number(req.body.iDcategoria);

        if (
            !Number.isInteger(categoria) ||
            categoria <= 0
        ) {
            return res.status(400).json({
                errore: "L'ID della categoria non è valido!"
            });
        }

        const risultatoCategoria = await database.query(
            `
                SELECT id
                FROM categorie
                WHERE id = $1
            `,
            [categoria]
        );

        if (risultatoCategoria.rows.length === 0) {
            return res.status(404).json({
                errore: "La categoria indicata non esiste!"
            });
        }

        req.body.iDcategoria = categoria;

        next();

    } catch (errore) {
        console.error("Errore validaCategoriaP:", errore);

        return res.status(500).json({
            errore: "Errore lato server durante il controllo della categoria!"
        });
    }
}