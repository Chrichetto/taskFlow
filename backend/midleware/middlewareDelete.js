export function validaIDP(req, res, next){
    const id = Number(req.body.id);

    if(Number.isNaN(id) || id <= 0){
        return res.status(400).json({
            messaggio: "Id non valido!"
        });
    }

    req.taskId = id;

    next();
};