'use strict';

function Drawer (el, btnEl, apod) {
    this.el = el;
    this.btnEl = btnEl;
    this.apod = apod;

    btnEl.addEventListener('click', this.toggle.bind(this));
    this.load();
}

Drawer.prototype = {

    clearAll () {
        chrome.storage.sync.remove(['apodFavorites'], () => {
            console.log('all cleared!!!');
            this.favorites = {};
            this.load();
        });
    },

    render () {
        let favoritesEl = $('.apod__drawer-view #drawer-list');
        favoritesEl.innerHTML = '';

        for (let apod in this.favorites) {
            let favorite = this.favorites[apod];
            let backgroundImage = 'background-image: url("' + favorite.imgUrl + '")';

            let listEl = document.createElement('li');
            listEl.className = 'favorite';

            let imageEl = document.createElement('div');
            imageEl.className = 'favorite__image';
            imageEl.setAttribute('style', backgroundImage);

            let titleEl = document.createElement('h4');
            titleEl.className = 'favorite__title';
            titleEl.textContent = favorite.title;

            listEl.addEventListener('click', () => {
                this.apod.specificDate(favorite.date);
            })

            listEl.appendChild(imageEl);
            listEl.appendChild(titleEl);

            favoritesEl.appendChild(listEl);
        }

    },

    toggle () {
        this.render();

        this.el.classList.toggle('show');
    },

    load () {
        this.get((favorites) => {
            this.favorites = favorites.apodFavorites || {};
        });
    },

    get (callback) {
        chrome.storage.sync.get(['apodFavorites'], callback);
    },

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
    },

}
