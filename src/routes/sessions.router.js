const {Router} = require('express');
const userModel = require('../models/user');

const sessionsRouter = Router();

sessionsRouter.post('/register',  async (req, res)=>{
    const {first_name, last_name, email, age, password} = req.body;

    if(!first_name || !last_name || !email || !age || !password){
        return res.status(404).send({status: 'error', error: 'Missing information'})
    }

    const result= await userModel.create({first_name, last_name, email, age, password})
    res.send({status: 'success', message: 'user has been registered'})
})

sessionsRouter.post('/login',  async (req, res)=>{
    const{email, password} = req.body;
    
    if(!email || !password){
        return res.status(404).send({status: 'error', error:'Missing information'})
    }

    const user = await userModel.findOne({email, password})
    if(!user){
        return res.status(401).send({status: 'error', error:'Incorrect credentials'})

    }

    let role = 'user'; 
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        role = 'admin'; 
    }


    req.sessions.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: role
    }
    res.send({status: 'success', payload: req.session.user, message: 'Log in was successful'})
})

sessionsRouter.get('/logout', (req, res)=>{
    req.session.destroy((err)=>{
        if(err) return res.status(500).send ('Error during destroying session')
    })
    res.redirect('/login')
})


module.exports = sessionsRouter;