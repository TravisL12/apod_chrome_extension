'use strict';

function Drawer (el, btnEl, apod) {
    this.el = el;
    this.btnEl = btnEl;
    this.apod = apod;

    btnEl.addEventListener('click', this.toggle.bind(this));
    $('#clear-all-favorites').addEventListener('click', this.clearAll.bind(this));

    this.load();
}

Drawer.prototype = {

    clearAll () {
        chrome.storage.sync.remove(['apodFavorites'], () => {
            console.log('all cleared!!!');
            $('.apod__drawer-view #drawer-list').innerHTML = '';
            this.favorites = {};
            this.load();
        });
    },

    render () {
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
