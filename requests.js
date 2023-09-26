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
        var $imageContainer = document.querySelector(".cocktail__container.image__container");
        var $instructionsContainer = document.querySelector(".cocktail__container.instructions__container");

        cocktail.elements.$button = $button;
        cocktail.elements.$cocktail = $cocktail;
        cocktail.elements.$cocktailTitle = $cocktailTitle;
        cocktail.elements.$cocktailImg = $cocktailImg;
        cocktail.elements.$cocktailIngredients = $cocktailIngredients;
        cocktail.elements.$cocktailInstructions = $cocktailInstructions;
        cocktail.elements.$cocktailDataContainer = $cocktailDataContainer;
        cocktail.elements.$imageContainer = $imageContainer;
        cocktail.elements.$instructionsContainer = $instructionsContainer;
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
            cocktail.elements.$imageContainer.classList.remove('open');
            cocktail.elements.$instructionsContainer.classList.remove('open');
            cocktail.elements.$button.classList.add("loading");
            cocktail.elements.$cocktail.hidden = true;
            return;
        }

        cocktail.elements.$cocktail.hidden = false;
        cocktail.elements.$button.classList.remove("loading");
    },

    getCocktailRandom: async function () {
        cocktail.loaderWork('start');

        var randomCocktailRequest = await cocktail.requestTemplate(cocktail.urls.random);
        var cocktailData = randomCocktailRequest.drinks[0];

        var nonAlcoholic = cocktailData.strAlcoholic === 'Non alcoholic';
        var isShot = cocktailData.strCategory === 'Shot';

        if(nonAlcoholic || isShot) {
            await cocktail.getCocktailRandom();
            return;
        }

        var randomCocktail = cocktail.formatData(cocktailData);
        cocktail.buildCocktailWrapper(randomCocktail);
        await cocktail.delay();

        cocktail.elements.$button.classList.add('bottom--position');
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
            return await responseRequest.json();
        } catch(error) {
            return error;
        }
    },

    delay: (ms = 1000) => new Promise((fn) => setTimeout(fn, ms)),

    buildCocktailWrapper: function(data) {
        cocktail.elements.$cocktailTitle.innerText = data.strDrink;
        cocktail.elements.$cocktailImg.src = data.strDrinkThumb;
        cocktail.elements.$cocktailImg.alt = data.strDrink;
        cocktail.elements.$cocktailIngredients.innerText = data.ingredients;
        cocktail.elements.$cocktailInstructions.innerText = data.strInstructions;
    }
};
