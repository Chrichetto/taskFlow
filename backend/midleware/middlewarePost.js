import database from "../database.js";

/**
 * Valida il nome ricevuto nel body.
 * Può essere usato sia per creare una task
 * sia per creare una categoria.
 */
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

    // Salviamo nel body il nome senza spazi inutili.
    req.body.nome = nome.trim();

    next();
}


/**
 * Controlla se una stringa rappresenta
 * una data SQL valida nel formato YYYY-MM-DD.
 */
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


/**
 * Valida sia dataInizio sia dataFine.
 */
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


/**
 * Valida la priorità.
 * Deve essere un numero intero compreso tra 0 e 5.
 */
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


/**
 * Valida il campo completata.
 * Dal frontend arriva come booleano:
 * true oppure false.
 */
export function valdiaCompletataP(req, res, next) {
    const completata = req.body.completata;

    if (typeof completata !== "boolean") {
        return res.status(400).json({
            errore: "Il campo completata deve essere true oppure false!"
        });
    }

    next();
}


/**
 * Controlla che la categoria ricevuta esista nel database.
 */
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

        const [risultatoCategoria] = await database.query(
            "SELECT id FROM Categorie WHERE id = ?",
            [categoria]
        );

        if (risultatoCategoria.length === 0) {
            return res.status(404).json({
                errore: "La categoria indicata non esiste!"
            });
        }

        req.body.iDcategoria = categoria;

        next();

    } catch (errore) {
        console.error(errore);

        return res.status(500).json({
            errore: "Errore lato server durante il controllo della categoria!"
        });
    }
}