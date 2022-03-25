
let data;
var request = new XMLHttpRequest();
request.open('GET', '/app/js/cocktail.json');
request.onloadend = function() {
    data = JSON.parse(request.responseText);
}
request.send();

let input = document.querySelector('.search__input');
let searchBtn = document.querySelector('.btn.btn_search-form');
let noResult = document.querySelector('.title.title_no-result');

input.oninput = function() {
    search();
};
searchBtn.onclick = function() {
    search();
};

function search() {
    noResult.style.display = input.value === '' ? 'block' : 'none';
    if (document.querySelector('.cocktail-list')) {
        document.querySelector('.cocktail-list').remove();
    };
    if (input.value === '') {
        return false;
    }
    let cocktailList = document.createElement('ul');
    cocktailList.classList.add('cocktail-list');
    let cocktailCard;
    let searchStr = input.value;
    searchStr = searchStr.toLowerCase()[0].toUpperCase() + searchStr.slice(1);
    let cocktailCount = 0;
    for(var i = 0; i < data.length; i += 1) {
        data[i].name = data[i].name.toLowerCase()[0].toUpperCase() + data[i].name.slice(1);
        if(data[i].name.includes(searchStr) === true) {
            cocktailCount += 1;
            cocktailCard = makeCocktailCard(data[i].name, data[i].shortDesciption, data[i].alcoholPresent, data[i].webpPrev, data[i].jpgPrev, data[i].link);
            cocktailList.append(cocktailCard);
        };
    };
    if (cocktailCount == 0) {
        cocktailCard = makeCocktailCard('Пусто', 'Попробуйте изменить запрос', 'Ничего не найдено', '/app/images/no-result.webp', '/app/images/no-result.jpg', '#')
        cocktailList.append(cocktailCard);
    };
    document.querySelector('.main').append(cocktailList);
};

function makeCocktailCard(nameValue,shortDesciption,alcoholPresent,imageWebp,imageJpg,link) { //создание карточки
    let cocktailCard = document.createElement('li');
    cocktailCard.classList.add('cocktail-card');
    let cocktailPicture = document.createElement('picture');
    cocktailPicture.classList.add('image');
    let cocktailImageSource = document.createElement('source');
    cocktailImageSource.setAttribute('srcset', imageWebp);
    cocktailImageSource.setAttribute('type','image/webp');
    let cocktailImage = document.createElement('img');
    cocktailImage.setAttribute('src', imageJpg);
    cocktailImage.setAttribute('alt', nameValue);
    cocktailImage.setAttribute('width', 'auto');
    cocktailImage.setAttribute('height', 'auto');
    cocktailPicture.append(cocktailImageSource,cocktailImage);
    let cocktailLink = document.createElement('a');
    cocktailLink.classList.add('cocktail-card__inner');
    cocktailLink.setAttribute('href', link);
    if(nameValue == 'Пусто') {
        let cocktaiNoResultText = document.createElement('p');
        cocktaiNoResultText.classList.add('text','text_no-result');
        cocktaiNoResultText.textContent = alcoholPresent;
        cocktailLink.append(cocktaiNoResultText);
    } else {
        let cocktaiAlcoholSticker = document.createElement('p');
        cocktaiAlcoholSticker.classList.add('cocktail-card__alcohol-sticker');
        let cocktaiAlcoholPresent = document.createElement('span');
        cocktaiAlcoholPresent.classList.add('cocktail-card__alcohol-present');
        cocktaiAlcoholPresent.textContent = alcoholPresent;
        cocktaiAlcoholSticker.append(cocktaiAlcoholPresent,'Алкоголь');
        cocktailLink.append(cocktaiAlcoholSticker);
    };
    let cocktailName = document.createElement('h2');
    cocktailName.classList.add('title','title_cocktail');
    cocktailName.textContent = nameValue;
    let cocktailShortDescription = document.createElement('p');
    cocktailShortDescription.classList.add('text');
    cocktailShortDescription.textContent = shortDesciption;
    cocktailLink.append(cocktailName,cocktailShortDescription);
    cocktailCard.append(cocktailPicture,cocktailLink);
    return cocktailCard;
};