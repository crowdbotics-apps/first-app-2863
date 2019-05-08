import uuidv4 from 'uuid/v4';
import { Router } from 'express';

const router = Router();

router.get('/users', async (req,res) => {
	const users = await req.context.models.User.findAll();
	return res.send(users)
});

router.get('/users/:user_id', async (req, res) => {
   const user = await req.context.models.User.findByPk(
   	 req.params.user_id,
   );

   if (user){
   	 res.send(`Username is: ${user.username}`);
   } else {
   	 res.send("User does not exist.");
   }
   	
});

export default router;