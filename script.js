/* TODO: inserite il codice JavaScript necessario a completare il MHW! */

const image_checked = "images/checked.png";
const image_unchecked = "images/unchecked.png";
const text_restart = "RICOMINCIA QUIZ"
const num=3;
const num_ans=9;
const checkboxes =[];
const result= {};
const allboxes = document.querySelectorAll('.choice-grid .all');
const result_container = document.querySelector('#result');
const choice_theme = document.querySelector('#choice');
let theme = true;

change_theme();
choice_theme.addEventListener("click", change_theme);
for (const boxitem of allboxes){
  boxitem.addEventListener("click", change_to_checked);
}

function change_theme(event){
if (theme){
  create_randombck();
  
} else{
  create_random_album();
}
  const bckground_rest = document.querySelectorAll('.choice-grid div');
  const unchecked_rest = document.querySelectorAll('.checkbox'); 
  
  for (const i of unchecked_rest){
      
      i.src = image_unchecked;
      } 
  
  for (const bck of bckground_rest) {
    
     bck.classList.remove('chosen');
     bck.classList.remove('no-chosen');
     checkboxes.splice(0,num);
    
   } 
}

function change_to_checked(event){

    const img_check = event.currentTarget.querySelector('.checkbox');
    const img_chosen = event.currentTarget;
    const bckground = event.currentTarget.parentNode.querySelectorAll('.all')
    const unchecked = event.currentTarget.parentNode.querySelectorAll('.checkbox'); 
    
    for (const i of unchecked){
        
        i.src = image_unchecked;
    } 
    
    for (const bck of bckground) {

       bck.classList.add('no-chosen');
       bck.classList.remove('chosen');

    } 
     
     img_check.src = image_checked;
     img_chosen.classList.remove('no-chosen');
     img_chosen.classList.add('chosen');

    unchecked_ok(img_chosen);
    checkboxes.push(img_chosen);

    if (checkboxes.length===num){
      answer()
      for (const boxitem of allboxes){
      boxitem.removeEventListener("click", change_to_checked);
      }
      choice_theme.removeEventListener("click", change_theme);
    }
}

function unchecked_ok(div){
      for (let i=0; i<checkboxes.length; i++){
        if (checkboxes[i].dataset.questionId === div.dataset.questionId )
        checkboxes.splice (i,1) 
      }
    }

function answer(){
  let count = 1;
  for (let i=0; i < checkboxes.length; i++){
      for (let j= i+1; j<= checkboxes.length -1; j++){
          if (checkboxes[i].dataset.choiceId === checkboxes[j].dataset.choiceId)
            count = count +1;
      }
    if (count >= ((Math.floor((checkboxes.length)/2)+1))){
        result.title = RESULTS_MAP[checkboxes[i].dataset.choiceId].title
        result.text = RESULTS_MAP[checkboxes[i].dataset.choiceId].contents
        break;
        
    }
      
    else{
      result.title = RESULTS_MAP[checkboxes[0].dataset.choiceId].title
      result.text = RESULTS_MAP[checkboxes[0].dataset.choiceId].contents
    }
  }
show_result();
}

function show_result(){

  const title_result = document.createElement('h2');
  result_container.classList.add('padding');
  title_result.textContent = result.title;
  const text_result = document.createElement('p');
  text_result.textContent = result.text;
  const btn = document.createElement('button');
  btn.id = "restart";
  btn.textContent = text_restart;
  btn.addEventListener('click', restart);
  result_container.querySelector('#title').appendChild(title_result);
  result_container.querySelector('#description').appendChild(text_result);
  result_container.querySelector('#btn').appendChild(btn);

}

function restart(){

  const bckground_rest = document.querySelectorAll('.choice-grid div');
  const unchecked_rest = document.querySelectorAll('.checkbox'); 
  result_container.classList.remove('padding');
  
  for (const i of unchecked_rest){
      
      i.src = image_unchecked;
      } 
  
  for (const bck of bckground_rest) {
    
     bck.classList.remove('chosen');
     bck.classList.remove('no-chosen');
     checkboxes.splice(0,num);
    
   } 
  for (const boxitem of allboxes){
     boxitem.addEventListener("click", change_to_checked);
    }
  
    result_container.querySelector('#title').innerHTML = '';
    result_container.querySelector('#description').innerHTML = '';
    result_container.querySelector('#btn').innerHTML = ''; 
    choice_theme.addEventListener("click", change_theme);
    create_randombck();
    theme=true;
 }

function create_randombck(){
  choice_theme.removeEventListener("click", choice_theme);
  choice_theme.innerHTML= '';
  const value = document.createElement('h3');
  value.textContent = 'Album';
  choice_theme.appendChild(value);
  theme= false;
  ans = num_ans * num;
  rest_url =" https://x-colors.yurace.pro/api/random?number=" + ans; 

  fetch(rest_url).then(onSuccess).then(onJson);
  choice_theme.addEventListener("click", choice_theme);
 
 }

function onText(colore){
   console.log(colore);
 }

function onSuccess(response){
 
  return response.json();
}

function onJson(json){

  const bckdiv = document.querySelectorAll('.random');

  for (let i=0; i<bckdiv.length; i++){
    bckdiv[i].style.backgroundImage = 'none';
    bckdiv[i].style.backgroundColor = json[i].hex;
  }
}

function create_random_album(){
  choice_theme.removeEventListener("click", choice_theme);
  choice_theme.innerHTML= '';
  const value = document.createElement('h3');
  value.textContent = 'Colori'
  choice_theme.appendChild(value);
  theme = true;
  url_t = 'https://accounts.spotify.com/api/token';
  client_id ='bc4cf83162fc4991b208a2994bc9cd82';
  secret_id ='33cc76d3a5734843b27a68aed177490d';
  //richiesta token 
    fetch(url_t,{
      method: "POST",
      body: 'grant_type=client_credentials',
      headers: {
      'Content-type':'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(client_id + ":" + secret_id)
    }
  }).then(tokenResponse).then(tokenJson);
  choice_theme.addEventListener("click", choice_theme);
}

function tokenResponse(token_Response){

  return token_Response.json();
}

function tokenJson(token_json){
  ans = num_ans * num;
  const token = token_json.access_token;
  url_f= 'https://api.spotify.com/v1/browse/new-releases?country=it&limit=' + ans; 
  fetch(url_f,{
    headers:{
      Authorization: 'Bearer ' + token 
    }
  }).then(responseAlbum).then(jsonAlbum)
}

function responseAlbum(response_Album){
  
  return response_Album.json();
}

function jsonAlbum(json_Album){
  const bckdiv = document.querySelectorAll('.random');
  bckdiv.innerHTML='';
  for (let i=0; i<bckdiv.length; i++){
    bckdiv[i].style.backgroundColor = 'none';
    const img_url = json_Album.albums.items[i].images[1].url;
    bckdiv[i].style.backgroundImage = "url('" + img_url + "')";
  }
}


