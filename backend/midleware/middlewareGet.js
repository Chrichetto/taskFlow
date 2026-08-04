import mysql from "mysql2/promise.js";
import express from "express";
import database from "../database.js";

export function validaID(req, res, next){
    const id = Number(req.params.id);

    if(Number.isNaN(id) || id <= 0){
        return res.status(400).json({
            messaggio: "Id non valido!"
        });
    }

    req.taskId = id;

    next();
};

export function validaNome(req, res, next){
    const nome = req.params.nome;

    if(!nome || nome.length === 0){
        return res.status(400).json({
            errore: "Errore nell'inserimento dei dati.."
        });
    }

    req.taskName = nome;

    next();
}

function isValidSQLDate(dateString) {
  const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!regex.test(dateString)) return false;
  
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  return date.getFullYear() === year &&
         date.getMonth() === month - 1 &&
         date.getDate() === day;
}


export function valdiaData(req, res, next){
    const data = req.params.data;

    if(!isValidSQLDate(data)){
        return res.status(400).json({
            errore: "La data non è valida!"
        });
    }

    req.taskData = data;

    next();
};

export function valdiaPriorita(req, res, next){
    const priorita = Number(req.params.priorita);

    if(priorita === undefined || priorita < 0 || priorita > 5){
        return res.status(400).json({
            errore: "Dati inseriti non corretti!"
        });
    }

    req.taskPriorita = priorita;

    next();
}

export function valdiaCompletata(req, res, next) {
  const valore = req.params.completata;

  if (valore !== "true" && valore !== "false") {
    return res.status(400).json({
      errore: "Il valore deve essere true oppure false"
    });
  }

  req.taskCompletata = valore === "true";
  next();
}


export async function validaCategoria(req, res, next){
    try{
        const categoria = Number(req.params.categoria);
        if(Number.isNaN(categoria)){
            return res.status(400).json({
                errore: "Dati inseriti non corretti"
            })
        }
        const [risultatoCategoria] = await database.query(
            "SELECT * FROM Categorie WHERE iDcategoria = ?",
            [categoria]
        );

        if(risultatoCategoria.length === 0){
            return res.status(400).json({
                errore: "Dati inseriti non corretti"
            })
        }

        req.taskCategoria = categoria;
        next();
    }catch(errore){
        console.log(errore);

        res.status(500).json({
            errore: "Errore Lato server!"
        });
    }
}