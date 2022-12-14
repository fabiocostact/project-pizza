const getEl = (el)=>document.querySelector(el);
const getAll = (el)=>document.querySelectorAll(el);
let cart = [];
let ModalKey, modalQt;

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

//minus +1
getEl('.pizzaInfo--qtmenos').addEventListener('click',()=>{
    if(modalQt > 1){
        modalQt--;
        getEl('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

//add 1
getEl('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalQt++;
    getEl('.pizzaInfo--qt').innerHTML = modalQt;
});

getEl('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let pizzaSize = parseInt(getEl('.pizzaInfo--size.selected').getAttribute('data-Key'));
    let pizzaId = pizzaJson[ModalKey].id;
    let pizzaIdentifier =  pizzaId+'@'+pizzaSize;
    let key = cart.findIndex((item)=> item.identifier == pizzaIdentifier);
   
    if(key > -1){
        //update cart
        cart[key].qtd += modalQt;
    }else{
        //add to pay
        cart.push({
            identifier: pizzaIdentifier,
            id: pizzaId,
            size: pizzaSize,
            qtd: modalQt
        });
    }

    updateCart();

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

getEl('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        getEl('aside').style.left = 0;
    }
})

getEl('.menu-closer').addEventListener('click', ()=>{
    getEl('aside').style.left = '100vw';
})

let updateCart = ()=>{

    getEl('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        getEl('aside').classList.remove('remove');
        getEl('aside').classList.add('show');

        getEl('.cart').innerHTML = '';
        let subTotal = 0;
        
        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            let cartItem = getEl('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaItem.name+' ('+pizzaSizeName+')';
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtd;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].qtd > 1){
                    cart[i].qtd--;
                }else{
                    cart.splice(i,1);
                } 
                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qtd++;
                updateCart();
            });

            subTotal += pizzaItem.price*cart[i].qtd;

            getEl('.cart').append(cartItem);
        }


        getEl('.subtotal span:last-child').innerHTML = 'R$ '+subTotal.toFixed(2);
        let desconto = (subTotal*0.10);
        getEl('.desconto span:last-child').innerHTML = 'R$ '+desconto.toFixed(2);
        getEl('.total span:last-child').innerHTML = 'R$ '+(subTotal-desconto).toFixed(2);


    }else{
        getEl('aside').classList.add('remove');
        getEl('aside').style.left = '100vw';
    }

}

//pizza aula 11