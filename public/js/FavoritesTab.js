'use strict';

function FavoritesTab (el, apod, drawer) {
    DrawerTab.call(this, el, apod, drawer);
    this.title = 'Favorites';
    this.keycode = 70;
    this.template = `
        <h1>Favorite APOD's</h1>
        <ul id='drawer-list'></ul>
        <div class='clear-all' id='clear-all-favorites'>Clear All</div>
    `;

    this.load();
};

FavoritesTab.prototype = Object.create(DrawerTab.prototype, {

    clearAll: {
        value: function () {
            chrome.storage.sync.remove(['apodFavorites'], () => {
                console.log('all cleared!!!');
                $('.apod__drawer-view #drawer-list').innerHTML = '';
                this.favorites = {};
                this.load();
            });
        }
    },

    render: {
        value: function () {
            this.baseView.innerHTML = this.template;
            $('#clear-all-favorites').addEventListener('click', this.clearAll.bind(this));

            let favoritesEl = $('.apod__drawer-view #drawer-list');
            favoritesEl.innerHTML = '';

            for (let apod in this.favorites) {
                const favorite = this.favorites[apod];
                const backgroundImage = 'background-image: url("' + favorite.imgUrl + '")';

                const listEl = document.createElement('li');
                listEl.className = 'favorite';

                listEl.innerHTML = `
                    <div class='favorite__image' style='${backgroundImage}'></div>
                    <h4 class='favorite__title'>${this.favorites[apod].title}</h4>
                `;

                listEl.addEventListener('click', () => {
                    this.apod.specificDate(favorite.date);
                })

                favoritesEl.appendChild(listEl);
            }
        }
    },

    load: {
        value: function () {
            this.get((favorites) => {
                this.favorites = favorites.apodFavorites || {};
            });
        }
    },

    get: {
        value: (callback) => {
           chrome.storage.sync.get(['apodFavorites'], callback);
        }
    },

    save: {
        value: function () {
            this.favorites[apod.date] = {
                title: apod.title,
                imgUrl: apod.url,
                date: apod.date,
            };

            chrome.storage.sync.set({
                apodFavorites: this.favorites,
            });

            this.load();
        }
    },

});
