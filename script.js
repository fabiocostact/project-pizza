const getEl = (el)=>document.querySelector(el);
const getAll = (el)=>document.querySelectorAll(el);
let cart = [];
let ModalKey,modalQt;

let popUp = (e)=>{
    e.preventDefault();//block main event

    //get the element and get attibute
    ModalKey= e.target.closest('.pizza-item').getAttribute('data-key');
    modalQt = 1;
    
    //show pizza data
    getEl('.pizzaBig img').src = pizzaJson[ModalKey].img;
    getEl('.pizzaInfo h1').innerHTML = pizzaJson[ModalKey].name;
    getEl('.pizzaInfo--desc').innerHTML = pizzaJson[ModalKey].description;
    getEl('.pizzaInfo--actualPrice').innerHTML = 'R$ '+pizzaJson[ModalKey].price.toFixed(2);
    getEl('.pizzaInfo--size.selected').classList.remove('selected');

    //get all pizza size
    getAll('.pizzaInfo--size').forEach((size, sizeIndex)=>{
        if(sizeIndex == 2){
            size.classList.add('selected');
        }
        
        size.querySelector('span').innerHTML = pizzaJson[ModalKey].sizes[sizeIndex];

        size.addEventListener('click', ()=>{
            getEl('.pizzaInfo--size.selected').classList.remove('selected');
            size.classList.add('selected');
        });
    });

    getEl('.pizzaInfo--qt').innerHTML = modalQt;

    //add +1
    getEl('.pizzaInfo--qtmenos').addEventListener('click',()=>{
        if(modalQt > 1){
            modalQt--;
            getEl('.pizzaInfo--qt').innerHTML = modalQt;
        }
    });

    //minus 1
    getEl('.pizzaInfo--qtmais').addEventListener('click',()=>{
        modalQt++;
        getEl('.pizzaInfo--qt').innerHTML = modalQt;
    });

    
    //open modal
    getEl('.pizzaWindowArea').style.opacity = 0;
    getEl('.pizzaWindowArea').style.display = 'flex';
    setTimeout(()=>{
        getEl('.pizzaWindowArea').style.opacity = 1;
    },200);

    //close modal
    getAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
        item.addEventListener('click',closeModal);
    });
    
}

getEl('.pizzaInfo--addButton').addEventListener('click', ()=>{
    //add to pay
    cart.push({
        id: pizzaJson[ModalKey].id,
        size: parseInt(getEl('.pizzaInfo--size.selected').getAttribute('data-Key')),
        qtd: modalQt
    });
    console.log(cart);
    closeModal();
});

pizzaJson.map((item, index)=>{
    //select the model and clone this
    let pizzaItem = getEl('.models .pizza-item').cloneNode(true);
 
    //add item
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = 'R$ '+item.price.toFixed(2);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    
    pizzaItem.querySelector('a').addEventListener('click', popUp);

    //add in html
    getEl('.pizza-area').append(pizzaItem);

});

 //modal event
let closeModal = ()=>{
    getEl('.pizzaWindowArea').style.opacity = 0;

    setTimeout(()=>{
        getEl('.pizzaWindowArea').style.display = 'none';
    },500);
}

//pizza aula 10