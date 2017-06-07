'use strict';

class FavoritesTab extends DrawerTab {

    constructor (el, apod, drawer) {
        super(el, apod, drawer);
        this.keycode = 70;
        this.template = `
            <div class='favorites'>
                <h2>Favorite APOD's</h2>
                <ul id='drawer-list'></ul>
            </div>
        `;

        $('#add-favorite').addEventListener('click', this.save.bind(this));

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

        if (this.isOpen) {
            this.render();
        }
    }

    render () {
        this.baseView.innerHTML = this.template;

        let favoritesEl = this.baseView.querySelector('#drawer-list');

        if (Object.keys(this.favorites).length) {
            favoritesEl.innerHTML = '';
        } else {
            favoritesEl.innerHTML = `
                <li class='no-favorites'>
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
                <div class='remove-favorite'>Remove</div>
            `;

            listEl.querySelector('.remove-favorite').addEventListener('click', () => {
                delete this.favorites[date];

                chrome.storage.sync.set({
                    apodFavorites: this.favorites,
                });

                this.render();
            })

            const linkSelectors = ['.favorite__image','.favorite__title-title','.favorite__title-date'];

            for (let i in linkSelectors) {
                listEl.querySelector(linkSelectors[i]).addEventListener('click', () => {
                    this.apod.specificDate(date);
                })
            }

            favoritesEl.appendChild(listEl);
        }
    }

};