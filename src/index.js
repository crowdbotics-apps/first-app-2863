import "dotenv/config";

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import routes from './routes';
import models, { sequelize } from './models';

//initialize express server
const app = express();

//invoke middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors());

//create middleware for utilizing model
app.use(async (req, res, next) => {
	req.context = {
		models,
		me: await models.User.findByLogin('Chad R')
	};
	next();
})

//invoke routes
app.use('/', routes.server);

const eraseDatabaseOnSync = true;

sequelize.sync({force: eraseDatabaseOnSync}).then(()=>{
  if(eraseDatabaseOnSync){
  	createUserWithMessages();
  }

  app.listen(process.env.DEFAULT_PORT, () => {
  	console.log(models)
	console.log(process.env.SERVER_INIT + `\nListening on Port ${process.env.DEFAULT_PORT}!`);
  });
})

const createUserWithMessages = async () => {
	await models.User.create({
      username: 'Chad R',
      messages: [{
      	text: 'How are you today?'
      }]
	},{
		include: [models.Message]
	}
	);
};


export function testfunc1() {
  return process.env.TEST
}

export function testfunc2(a, b){
  return a + b;
}
