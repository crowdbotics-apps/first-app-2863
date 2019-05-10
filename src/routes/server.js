import uuidv4 from 'uuid/v4';
import { Router } from 'express';
const { createApolloFetch } = require('apollo-fetch');

const fetch = createApolloFetch({
  uri: 'https://searchlight-dev-backend-pr-6.herokuapp.com/graphql',
});

const router = Router();

function getPosition(id = ''){
  fetch({
  	query: `{positions(input:{${id}}) { positionId positionTitle } }`, 
  })
  .then( r => {
  	let positions = r.data.positions;
  	console.log(positions[0].positionTitle); 
  })
  .catch(e => console.log(e) );
}

function getCompanies(id = ''){
  fetch({
  	query: `{companies(input:{${id}}) { companyId companyName } }`, 
  })
  .then( r => {
  	let companies = r.data;
  	console.log(companies); 
  })
  .catch(e => console.log(e) );
}

function addCompany(companyName){
	const variables = {
      input: {companyName: companyName}
	},
	query = `mutation AddCompany ($input: NewCompanyInput!){
               addCompany(input: $input){
                 companyName,
                 companyId
               }
             }`;
	fetch({
		query,
		variables
	})
	.then(r => {
		let company = r;
		console.log(company);
	})
	.catch(r => console.log(r));
}

function getCandidateProfiles(id){

  id = (id != '') ? `candidateProfileId: ${id}` : `${id}`;

  fetch({
  	query: `{candidateProfiles(input:{${id}}) { candidateProfileId candidateEmail user { firstName lastName} } }`, 
  })
  .then( r => {
  	let candidates = r.data;
  	console.log(candidates); 
  })
  .catch(e => console.log(e) );
}


function addCandidateProfile(email,firstName, lastName){
	const variables = {
		input: {
			candidateEmail: email,
			firstName: firstName,
			lastName: lastName,
		}
	}, query = `mutation AddCandidateProfile ($input: CreateCandidateProfileInput!){
                  addCandidateProfile (input: $input){
                    candidateProfileId
                    user{
                      username
                      firstName
                      lastName
                      isArchived
                    }
                    experienceSections{
                      experienceSectionId
                      componentText
                    }
                    permissions
                  }
                }
    `;
     
    fetch({
		query,
		variables
	})
	.then(r => {
		let candidate = r;
		console.log(candidate);
	})
	.catch(r => console.log(r));

}

function getCandidatePositionRelations(id = ''){
  fetch({
  	query: `{candidatePositionRelations(input:{${id}}) { candidateInvitedDate candidatePositionRelationId } }`, 
  })
  .then( r => {
  	let positions = r.data;
  	console.log(positions); 
  })
  .catch(e => console.log(e) );
}

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

router.get('/positions/:id?', (req, res ) => {
  let id = req.params.id ? req.params.id : '';
  getPosition(id);
  res.send(`route hit.`);
})

router.get('/companies/:id?', (req, res ) => {
  let id = req.params.id ? req.params.id : '';
  getCompanies(id);
  res.send(`route hit.`);
})

router.post('/companies/:companyName', (req, res) => {

  let companyName = req.body.companyName;
  addCompany(companyName);
  res.send('post request sent');

})

router.get('/candidates/:id?', (req, res) => {
  let id = req.params.id ? req.params.id : '';
  console.log("id:" +  id);
  getCandidateProfiles(id);
  res.send(`route hit.`);
})

router.post('/candidates/:candidateEmail/:firstname/:lastname', (req, res) => {

  let email = req.body.candidateEmail,firstName=req.body.firstname, lastName = req.body.lastname;
  addCandidateProfile(email, firstName, lastName);
  res.send('post request sent');

})

router.get('/position_relations/:id?', (req, res ) => {
  let id = req.params.id ? req.params.id : '';	
  getCandidatePositionRelations(id);
  res.send(`route hit.`);
})



export default router;