const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine','pug');
var todos = [{id:1, title:'Task 1'}, {id:2, title:'Task 2 '}, {id:3, title:'Task 3'}];


app.use(bodyParser.urlencoded({ extended: false }))

// give permission to edit json file
app.use(bodyParser.json())

app.get('/', (request, response) => {    //Fetching all the To do's on web browser 
  
  response.render('index',{message:todos,text:'The Whole List is as Follows:'});
 // response.status(200).json(todos)


});

app.post('/', (request, response) => {       //entering a new to do 
  
  var newTodo = request.body.title;
  
  if(!newTodo)
  return response.status(404).render('index',{text:'There was an error!Please try again'});
 
  const new_todo={
      id:todos.length+1,
      title:newTodo
    };
  
  todos.push(new_todo);      
  response.render('index',{message:todos,text:'Modified list is as follows'});
  //response.send(todos);
  
});


app.put('/:id',(request,response)=>{           //modifying specific postion
 const mod_id=parseInt(request.params.id); 
 if(mod_id>todos.length)
   return response.status(400).render('index',{text:'Specified index is not available'});
 const mod_title=request.body.title;
 todos[mod_id-1].title=mod_title;
 //response.send(todos);
 response.render('index',{message:todos,text:'Modified list is as follows'});
});


app.post('/:id',(request,response) =>{   //Posting in an specific position
   const mod_id=request.params.id;
   
   if(mod_id>todos.length)
   return response.status(400).render('index',{text:'Specified index is not available'});
   else{
     var todos_mod=[];
    
    flag=false;
    visited=false;
    for(i=0;i<=todos.length+1;i++) 
     {
       element=todos[i];
       if(element==undefined)
       {
       todos_mod.push({
         id:i+1,title:temp
       });
       todos=todos_mod;
       break;
      }
       
      if(element.id==mod_id){
        flag=true;
      }
      if(flag==false){
        todos_mod.push(element);
        continue;
      }
      
         if(flag==true) 
      {
        
         
         if(visited==false){
           visited=true;
           temp=element.title;//current
          element.title=request.body.title;
          element.id=i+1;
          todos_mod.push(element);
          
          
         }
         else
         {
           temp1=element.title;
           element.title=temp;
           element.id=i+1;
           todos_mod.push(element);
           temp=temp1;
            
         }
      }
    
    }
  }
  response.render('index',{message:todos,text:'Modified list as follows'});
  //response.send(todos_mod);
});
app.get('/:id',(request,response)=>{
  const pos=parseInt(request.params.id);
  if(pos>todos.length){
    response.status(404).render('index',{text:'Error....Please enter a valid id'});
  }
  else
  response.render('index',{message:todos,id:pos,text:'Item at that position is:'});
  //response.send(todos[pos-1]);
});
app.delete('/:id',(request,response) =>{
  var del_id=parseInt(request.params.id);
  if(!del_id)
  response.status(400).render('index',{text:'There is an error!...Please Enter valid data '});
  if(del_id<=todos.length){
    
  todos.splice(del_id-1,1);
  i=1;
  todos.forEach(element => {
    element.id=i;
    i++;
  });
  }
  else
  return response.status(404).render('index',{text:'The content with specified id is not found'});
 //response.send(todos);
 response.render('index',{message:todos,text:'After deleting,list is:'});
});
const port=process.env.PORT ||3000;
app.listen(port,()=>{
  console.log("Listening on port "+port);
  console.log('http://localhost:'+port);
});
