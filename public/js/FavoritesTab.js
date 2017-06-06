'use strict';

class FavoritesTab extends DrawerTab {

    constructor (el, apod, drawer) {
        super(el, apod, drawer);
        this.title = 'Favorites';
        this.keycode = 70;
        this.template = `
            <h1>Favorite APOD's</h1>
            <ul id='drawer-list'></ul>
            <div class='clear-all' id='clear-all-favorites'>Clear All</div>
        `;

        this.load();
    }

    clearAll () {
        chrome.storage.sync.remove(['apodFavorites'], () => {
            console.log('all cleared!!!');
            $('.apod__drawer-view #drawer-list').innerHTML = '';
            this.favorites = {};
            this.load();
        });
    }

    render () {
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

    load () {
        this.get((favorites) => {
            this.favorites = favorites.apodFavorites || {};
        });
    }

    get (callback) {
       chrome.storage.sync.get(['apodFavorites'], callback);
    }

    save () {
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

};
