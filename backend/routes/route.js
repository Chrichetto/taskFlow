import {
    getTasks,
    getTaskById,
    getTaskByName,
    getTaskByDataInizio,
    getTaskByDataFine,
    getTaskByPriorita,
    getTaskByCompletata,
    getTaskByCategoria,
    getCategoria,
    getCategoriaId
} from "../controller/controllerGet.js";

import express from "express";

import {
    valdiaCompletata,
    valdiaData,
    valdiaPriorita,
    validaCategoria,
    validaID,
    validaNome
} from "../midleware/middlewareGet.js";

import {
    createCategoria,
    createTask
} from "../controller/controllerPost.js";

import {
    valdiaCompletataP,
    valdiaDataP,
    valdiaPrioritaP,
    validaCategoriaP,
    validaNomeP
} from "../midleware/middlewarePost.js";

import {
    updateCategoria,
    updateTask
} from "../controller/controllerPut.js";

import {
    validaIDP
} from "../midleware/middlewareDelete.js";

import {
    deleteCategoria,
    deleteTask
} from "../controller/cotrollerDelete.js";


const router = express.Router();


/*
 * GET
 */

router.get(
    "/",
    getTasks
);

router.get(
    "/id/:id",
    validaID,
    getTaskById
);

router.get(
    "/nome/:nome",
    validaNome,
    getTaskByName
);

router.get(
    "/data-inizio/:data",
    valdiaData,
    getTaskByDataInizio
);

router.get(
    "/data-fine/:data",
    valdiaData,
    getTaskByDataFine
);

router.get(
    "/priorita/:priorita",
    valdiaPriorita,
    getTaskByPriorita
);

router.get(
    "/completata/:completata",
    valdiaCompletata,
    getTaskByCompletata
);

router.get(
    "/categoria/:categoria",
    validaCategoria,
    getTaskByCategoria
);

router.get(
    "/categorie/nome/:nome",
    validaNome,
    getCategoria
);

router.get(
    "/categorie/id/:id",
    validaID,
    getCategoriaId
);


/*
 * POST
 */

router.post(
    "/tasks",
    validaCategoriaP,
    validaNomeP,
    valdiaCompletataP,
    valdiaDataP,
    valdiaPrioritaP,
    createTask
);

router.post(
    "/categorie",
    validaNomeP,
    createCategoria
);


/*
 * PUT
 */

router.put(
    "/tasks",
    validaCategoriaP,
    validaNomeP,
    valdiaCompletataP,
    valdiaDataP,
    valdiaPrioritaP,
    updateTask
);

router.put(
    "/categorie",
    validaNomeP,
    updateCategoria
);


/*
 * DELETE
 */

router.delete(
    "/tasks",
    validaIDP,
    deleteTask
);

router.delete(
    "/categorie",
    validaIDP,
    deleteCategoria
);


export default router;