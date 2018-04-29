import { $, clearElement, htmlToElements } from '../utilities';
import DrawerTab from './DrawerTab';
import DateManager from '../DateManagement';

export default class FavoritesTab extends DrawerTab {
    constructor(el) {
        super(el);
        this.keycode = 70;
        this.template = htmlToElements(`
            <div class='favorites'>
                <h2>Favorite APOD's</h2>
                <ul id='drawer-list'></ul>
            </div>
        `);

        $('#add-favorite').addEventListener('click', this.save.bind(this));

        this.load();
    }

    load() {
        chrome.storage.sync.get(['apodFavorites'], favorites => {
            this.favorites = favorites.apodFavorites || {};
        });
    }

    checkFavorite() {
        const favoriteDates = Object.keys(this.favorites);
        const isFavorite = favoriteDates.indexOf(this.date) > 0;
        $('#add-favorite .favorite').classList.toggle('hide', !isFavorite);
        $('#add-favorite .not-favorite').classList.toggle('hide', isFavorite);
    }

    save() {
        if (this.favorites[this.date]) {
            delete this.favorites[this.date];
        } else {
            this.favorites[this.date] = {
                title: this.title,
                imgUrl: this.url,
            };
        }

        chrome.storage.sync.set({
            apodFavorites: this.favorites,
        });

        this.checkFavorite();

        this.load();

        if (this.el.classList.contains('is-open')) {
            this.render();
        }
    }

    render() {
        let favoritesEl = this.baseView.querySelector('#drawer-list');
        clearElement(favoritesEl);

        if (Object.keys(this.favorites).length === 0) {
            favoritesEl.appendChild(
                htmlToElements(`
                <li class='no-favorites'>
                    <h4>You don't have any favorites yet!</h4>
                    <h4>Click the "Save Favorite" button at the top right of the page!</h4>
                </li>`),
            );
        }

        for (let date in this.favorites) {
            const favorite = this.favorites[date];
            const backgroundImage = 'background-image: url("' + favorite.imgUrl + '")';

            const listEl = htmlToElements(
                `<li class='favorite'>
                    <div class='favorite__image'>
                        <div class='favorite__image-image' style='${backgroundImage}'></div>
                    </div>
                    <div class='favorite__title'>
                        <p class='favorite__title-date'>${DateManager.prettyDateFormat(date)}</p>
                        <p class='favorite__title-title'>${this.favorites[date].title}</p>
                    </div>
                    <div class='remove-favorite'>Remove</div>
                </li>`,
            );

            listEl.querySelector('.remove-favorite').addEventListener('click', () => {
                delete this.favorites[date];

                chrome.storage.sync.set({
                    apodFavorites: this.favorites,
                });

                this.render();
            });

            const linkSelectors = [
                '.favorite__image',
                '.favorite__title-title',
                '.favorite__title-date',
            ];

            for (let i in linkSelectors) {
                listEl.querySelector(linkSelectors[i]).addEventListener('click', () => {
                    this.specificDate(date);
                });
            }

            favoritesEl.appendChild(listEl);
        }
    }
}
