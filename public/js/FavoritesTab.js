'use strict';

class FavoritesTab extends DrawerTab {

    constructor (el, apod, drawer) {
        super(el, apod, drawer);
        this.title = 'Favorites';
        this.keycode = 70;
        this.template = `
            <div class='favorites'>
                <h2>Favorite APOD's</h2>
                <ul id='drawer-list'></ul>
                <div class='clear-all' id='clear-all-favorites'>Clear All</div>
            </div>
        `;

        this.load();
    }

    get (callback) {
       chrome.storage.sync.get(['apodFavorites'], callback);
    }

    load () {
        this.get((favorites) => {
            this.favorites = favorites.apodFavorites || {};
        });
    }

    save () {
        this.favorites[apod.date] = {
            title: apod.title,
            imgUrl: apod.url,
        };

        chrome.storage.sync.set({
            apodFavorites: this.favorites,
        });

        this.load();
    }

    deleteAllFavorites () {
        chrome.storage.sync.remove(['apodFavorites'], () => {
            console.log('all cleared!!!');
            $('.apod__drawer-view #drawer-list').innerHTML = '';
            this.favorites = {};
            this.load();
        });
    }

    render () {
        this.baseView.innerHTML = this.template;
        $('#clear-all-favorites').addEventListener('click', this.deleteAllFavorites.bind(this));

        let favoritesEl = $('.apod__drawer-view #drawer-list');

        if (Object.keys(this.favorites).length) {
            favoritesEl.innerHTML = '';
        } else {
            favoritesEl.innerHTML = `
                <li>
                    <h4>You don't have any favorites yet!</h4>
                    <h4>Click the "Save Favorite" button at the bottom of the page!</h4>
                </li>`;
        }

        for (let date in this.favorites) {
            const favorite = this.favorites[date];
            const backgroundImage = 'background-image: url("' + favorite.imgUrl + '")';

            const listEl = document.createElement('li');
            listEl.className = 'favorite';

            listEl.innerHTML = `
                <div class='favorite__image'>
                    <div class='favorite__image-image' style='${backgroundImage}'></div>
                </div>
                <div class='favorite__title'>
                    <p class='favorite__title-date'>${DateManager.prettyDateFormat(date)}</p>
                    <p class='favorite__title-title'>${this.favorites[date].title}</p>
                </div>
            `;

            listEl.addEventListener('click', () => {
                this.apod.specificDate(date);
            })

            favoritesEl.appendChild(listEl);
        }
    }

};
