"use strict"
import productData from "./product.json" assert { type: "json" };

function makeProduct(id, name, taste, features, wt, count) { //создание карточки
    let productItem = document.createElement('li');
    productItem.classList.add('product-item');
    productItem.id = id;
    if(count <= 0) {
        productItem.classList.add('product-item--disable');
    }
    let productCard = document.createElement('div');
    productCard.classList.add('product-item__card');
    let productTagline = document.createElement('p');
    productTagline.classList.add('product-item__tagline');
    productTagline.textContent = "Сказочное заморское яство"
    let productInner = document.createElement('div');
    productInner.classList.add('product-item__inner');
    let productName = document.createElement('h2');
    productName.classList.add('product-item__name');
    productName.textContent = name;
    let productTaste = document.createElement('p');
    productTaste.classList.add('product-item__taste');
    productTaste.textContent = taste;
    let productFeatures = document.createElement('ul');
    productFeatures.classList.add('product-item__features');
    features.forEach(function(feature) {
        let productFeaturesItem = document.createElement('li');
        productFeaturesItem.classList.add('product-item__features-item');
        productFeaturesItem.textContent = feature;
        productFeatures.append(productFeaturesItem);
    });
    let productImage = document.createElement('img');
    productImage.classList.add('product-item__image');
    productImage.setAttribute('src', "./img/Photo.png");
    productImage.setAttribute('alt', name);
    let productWt = document.createElement('p');
    productWt.classList.add('product-item__wt');
    let productWtNumber = document.createElement('span');
    productWtNumber.classList.add('product-item__wt-number');
    productWtNumber.textContent = wt;
    productWt.append(productWtNumber, " кг")
    let productAvailability = document.createElement('p');
    productAvailability.classList.add('product-item__availability');
    let productAvailabilityLink = document.createElement('a');
    productAvailabilityLink.classList.add('product-item__availability-link');
    productAvailabilityLink.textContent = "купи";
    productAvailabilityLink.setAttribute("href", "javascript:void(0);");
    if(count <= 0) {
        productAvailability.append("Печалька, " , taste, " закончился.")
    } else {
        productAvailability.append("Чего сидишь? Порадуй котэ, " ,productAvailabilityLink, ".")
    }
    productInner.append(productName, productTaste, productFeatures, productImage, productWt)
    productCard.append(productTagline, productInner)
    productItem.append(productCard,productAvailability)
    return productItem;
};

let productList = document.querySelector('.product-list');
productData.forEach( function(product, id){
    productList.append(makeProduct( id, product.name, product.taste, product.features, product.wt, product.count));
})

let products = document.querySelectorAll('.product-item');
products.forEach(function(product){
    let productCard = product.querySelector('.product-item__card');
    let productLink = product.querySelector('.product-item__availability-link');
    productCard.onclick = () => productClick(product);
    if(productLink) {
        productLink.onclick = () => productClick(product);
    }
})

function productClick(product) {
    let id = product.id;
    let productTagline = product.querySelector('.product-item__tagline');
    function handleEnter() {
        if(productTagline.textContent != 'Котэ не одобряет?' && !product.classList.contains('product-item--nohover') && product.classList.contains('product-item--selected')){
            productTagline.classList.add('product-item__tagline--selected-hover')
            productTagline.textContent = 'Котэ не одобряет?'
        }
    }
    function handleLeave() {
        if(productTagline.textContent != 'Сказочное заморское яство'){
            productTagline.textContent = 'Сказочное заморское яство'
            productTagline.classList.remove('product-item__tagline--selected-hover')
        }
        product.classList.remove('product-item--nohover')
    }
    if(!product.classList.contains('product-item--disable')){
        
        if(!product.classList.contains('product-item--selected')){
            product.classList.add('product-item--selected');
            product.querySelector('.product-item__availability').innerHTML = productData[id].availability;
            product.classList.add('product-item--nohover')
            product.onmouseenter = handleEnter;
            product.onmouseleave = handleLeave;
        } else {
            product.classList.remove('product-item--selected');
            let productAvailabilityLink = document.createElement('a');
            productAvailabilityLink.classList.add('product-item__availability-link');
            productAvailabilityLink.textContent = "купи";
            productAvailabilityLink.setAttribute("href", "javascript:void(0);");
            product.querySelector('.product-item__availability').textContent = '';
            product.querySelector('.product-item__availability').append("Чего сидишь? Порадуй котэ, " ,productAvailabilityLink, ".");
            productAvailabilityLink.onclick = () => productClick(product);
            if(productTagline.textContent != 'Сказочное заморское яство'){
                productTagline.textContent = 'Сказочное заморское яство'
                productTagline.classList.remove('product-item__tagline--selected-hover')
            }
            if(product.classList.contains('product-item--nohover')){
                product.classList.remove('product-item--nohover')
            }
        }
    }
};