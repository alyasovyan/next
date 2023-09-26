cocktail = {
    elements: {},
    urls: {
        random: "https://thecocktaildb.com/api/json/v1/1/random.php",
    },

    init: function() {
        cocktail.initElements();

        cocktail.elements.$button.addEventListener("click", cocktail.getCocktailRandom);
        cocktail.elements.$cocktailDataContainer
            .forEach(item => item.addEventListener("click", cocktail.visibleCocktailData));
    },

    initElements: function() {
        var $button = document.querySelector(".button");

        var $cocktail = document.querySelector(".cocktail");
        var $cocktailTitle = document.querySelector(".cocktail__title");
        var $cocktailImg = document.querySelector(".cocktail__img");
        var $cocktailIngredients = document.querySelector(".cocktail__ingredients");
        var $cocktailInstructions = document.querySelector(".cocktail__instructions");
        var $cocktailDataContainer = document.querySelectorAll(".cocktail-container");

        cocktail.elements.$button = $button;
        cocktail.elements.$cocktail = $cocktail;
        cocktail.elements.$cocktailTitle = $cocktailTitle;
        cocktail.elements.$cocktailImg = $cocktailImg;
        cocktail.elements.$cocktailIngredients = $cocktailIngredients;
        cocktail.elements.$cocktailInstructions = $cocktailInstructions;
        cocktail.elements.$cocktailDataContainer = $cocktailDataContainer;
    },

    visibleCocktailData: function(event) {
        var target = event.currentTarget;
        var type = target.dataset.button;

        if(type) {
            document.querySelector('[data-button="' + type + '"] .cocktail__container').classList.toggle('open');
        }
    },

    loaderWork: function(type) {
        if(type === 'start') {
            cocktail.elements.$button.classList.add("loading");
            cocktail.elements.$cocktail.hidden = true;
            return;
        }
        cocktail.elements.$button.classList.remove("loading");
        cocktail.elements.$cocktail.hidden = false;
    },

    getCocktailRandom: async function () {
        cocktail.loaderWork('start');

        var randomCocktailRequest = await cocktail.requestTemplate(cocktail.urls.random);
        var randomCocktail = cocktail.formatData(randomCocktailRequest.drinks[0]);

        if(randomCocktail.strAlcoholic === 'Non alcoholic' || randomCocktail.strCategory === 'Shot') {
            await cocktail.getCocktailRandom();
            return;
        }

        await cocktail.delay();


        cocktail.buildCocktailWrapper(randomCocktail);
        this.classList.add('bottom--position');
        cocktail.loaderWork();
    },

    formatData: function(data) {
        var formatData = {};
        formatData.ingredients = [];
        formatData.strMeasure = {};

        for(var key in data) {
            if(!data[key]) {
                continue;
            }

            if(key === 'strDrink') {
                formatData.strDrink = data[key];
                continue;
            }

            if(key.includes('strIngredient')) {
                formatData.ingredients.push(data[key]);
                continue;
            }

            if(key.includes('strDrinkThumb')) {
                formatData.strDrinkThumb = data[key];
                continue;
            }

            if(key === 'strInstructions') {
                formatData.strInstructions = data[key];
                continue;
            }

            if(key.includes('strMeasure')) {
                formatData.strMeasure[key] = data[key];
                continue;
            }
        }

        formatData.ingredients = formatData.ingredients.join(', ');
        return formatData;
    },

    requestTemplate: async function(url) {
        try {
            var responseRequest = await fetch(url);
            var responseArray = await responseRequest.json();
            return responseArray;
        } catch(error) {
            return error;
        }
    },

    delay: (ms = 1000) => new Promise(r => setTimeout(r, ms)),

    buildCocktailWrapper: function(data) {
        cocktail.elements.$cocktailTitle.innerText = data.strDrink;
        cocktail.elements.$cocktailImg.src = data.strDrinkThumb;
        cocktail.elements.$cocktailImg.alt = data.strDrink;
        cocktail.elements.$cocktailIngredients.innerText = data.ingredients;
        cocktail.elements.$cocktailInstructions.innerText = data.strInstructions;
    }
};

// dateModified:"2016-07-18 22:34:37"
// idDrink:"13899"
// strAlcoholic:"Alcoholic"
// strCategory:"Shot"
// strCreativeCommonsConfirmed:"No"
// strDrink:"3 Wise Men"
// strDrinkAlternate:null
// strDrinkThumb:"https://www.thecocktaildb.com/images/media/drink/wxqpyw1468877677.jpg"
// strGlass:"Collins glass"
// strIBA:null
// strImageAttribution:null
// strImageSource:null
// strIngredient1:"Jack Daniels"
// strIngredient2:"Johnnie Walker"
// strIngredient3:"Jim Beam"
// strIngredient4:null
// strIngredient5:null
// strIngredient6:null
// strIngredient7:null
// strIngredient8:null
// strIngredient9:null
// strIngredient10:null
// strIngredient11:null
// strIngredient12:null
// strIngredient13:null
// strIngredient14:null
// strIngredient15:null
// strInstructions:"put them them in a glass... and slam it to tha head."
// strInstructionsDE:"In ein Glas geben... und ab in den Schädel."
// strInstructionsES:null
// strInstructionsFR:null
// strInstructionsIT:"mettetele in un bicchiere ... E buona fortuna!"
// strInstructionsZH-HANS:null
// strInstructionsZH-HANT:null
// strMeasure1:"1/3 oz "
// strMeasure2:"1/3 oz "
// strMeasure3:"1/3 oz "
// strMeasure4:null
// strMeasure5:null
// strMeasure6:null
// strMeasure7:null
// strMeasure8:null
// strMeasure9:null
// strMeasure10:null
// strMeasure11:null
// strMeasure12:null
// strMeasure13:null
// strMeasure14:null
// strMeasure15:null
// strTags:null
// strVideo:null
