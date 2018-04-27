import reqwest from 'reqwest';
import { $, clearElement } from '../utilities';
import ga from '../utils/ga';
import DateManager from '../DateManagement';
import KnowMoreComponent from './KnowMore';
import { zeroPad } from '../utilities';
import { drawer, favoritesTab } from '../../index.js';
import NavigationButton from '../NavigationButton';

// Initialize image & video elements
const apodImage = $('#apod-image');
const apodVideo = $('#apod-video');
const apodImageVert = $('#apod-image-vertical-bg');
const apodVideoFrame = $('#apod-video iframe');

// Initialize various elements
const apodTitle = $('#apod-title');
const apodDate = $('#apod-date');
const apodKnowMore = $('#know-more-tabs');
const apodLoading = $('#apod-loading');
const apodError = $('#apod-error');
const imgQualityEl = $('#img-quality');

// Initialize button objects
const apodRandom = new NavigationButton('#apod-random', 82, 'random');
const apodCurrent = new NavigationButton('#apod-current', 84, 'current');
const apodPrevious = new NavigationButton('#apod-previous', 74, 'previous');
const apodNext = new NavigationButton('#apod-next', 75, 'next');
const loadHiResEl = $('.nav-buttons #show-hi-res');

const favoriteButtonShow = $('#add-favorite .favorite');
const favoriteButtonHide = $('#add-favorite .not-favorite');

class Apod {
    constructor() {
        this.hiResOnly = false;
        this.errorCount = 0;
        this.errorLimit = 3;
    }

    random() {
        this.getApod(DateManager.randomDate());
    }

    specificDate(date) {
        this.getApod(date);
    }

    previous() {
        this.getApod(DateManager.adjacentDate(this.date, -1));
    }

    next() {
        this.getApod(DateManager.adjacentDate(this.date, 1));
    }

    current() {
        this.getApod();
    }

    addFadedBackground() {
        apodImageVert.style['background-image'] = 'url(' + this.loadedImage.src + ')';
        apodImageVert.classList.remove('hide');
    }

    backgroundSize() {
        const widthGTwindow = this.loadedImage.width > window.innerWidth;
        const heightGTwindow = this.loadedImage.height > window.innerHeight;
        const aspectRatio = this.loadedImage.width / this.loadedImage.height;

        if (widthGTwindow || heightGTwindow) {
            this.addFadedBackground();
            return aspectRatio >= 1.3 ? 'cover' : 'contain';
        }

        if (
            this.loadedImage.width / window.innerWidth > 0.5 ||
            this.loadedImage.height / window.innerHeight > 0.5
        ) {
            this.addFadedBackground();
        }

        return 'auto';
    }

    _setLoadingView() {
        apodImage.style['background-image'] = '';
        apodImage.style['background-size'] = '';
        apodImage.classList.add('hide');

        apodImageVert.style['background-image'] = '';
        apodVideo.classList.add('hide');
        apodVideoFrame.src = '';

        $('.apod__header .description').classList.add('hide');
        loadHiResEl.classList.add('hide');
        apodLoading.classList.remove('hide');
        clearElement(apodKnowMore);

        drawer.closeDrawer();
        drawer.clearKnowMoreTabs();
    }

    isRequestValid() {
        if (this.isRequestInProgress) {
            return false;
        }

        this.isRequestInProgress = true;

        return this.isRequestInProgress;
    }

    getApod(date) {
        date = date || DateManager.today;

        if (!this.isRequestValid()) {
            console.log('Request in Progress!');
            return;
        }

        if (!DateManager.isDateValid(date)) {
            this.isRequestInProgress = false;
            return;
        }

        this._setLoadingView();

        reqwest({
            method: 'GET',
            url: 'https://api.nasa.gov/planetary/apod',
            data: {
                api_key: 'hPgI2kGa1jCxvfXjv6hq6hsYBQawAqvjMaZNs447',
                date: date,
            },
        }).then(
            response => {
                ga({ category: 'APOD', action: 'viewed', label: response.date });
                this.title = response.title;
                this.url = response.url;
                this.hdurl = response.hdurl;
                this.date = response.date;
                this.explanation = response.explanation;
                this.errorCount = 0;
                this.checkFavorite();

                if (response.media_type === 'image') {
                    apodImage.classList.remove('hide');
                    apodVideo.classList.add('hide');
                    this.preLoadImage(this.hiResOnly);
                } else if (response.media_type === 'video') {
                    apodImage.classList.add('hide');
                    apodVideo.classList.remove('hide');
                    this.apodVideo();
                } else {
                    this.random();
                }
            },
            error => {
                this.errorCount++;
                console.log(`Error: APOD API response (${this.errorCount})`);
                this.isRequestInProgress = false;
                if (this.errorCount < this.errorLimit) {
                    this.random();
                } else {
                    apodError.textContent = 'NASA APOD Error: Please reload or try Again Later';
                }
            },
        );
    }

    checkFavorite() {
        const isFavorite = favoritesTab.favoriteDates.indexOf(this.date) > 0;

        favoriteButtonShow.classList.toggle('hide', !isFavorite);
        favoriteButtonHide.classList.toggle('hide', isFavorite);
    }

    highlightResults(result, index) {
        const re = new RegExp('\\b(' + result + ')\\b', 'gi');
        this.explanation = this.explanation.replace(
            re,
            `<span class="keyword keyword-${index}">$1</span>`,
        );
    }

    wouldYouLikeToKnowMore(text) {
        const knowMore = new KnowMoreComponent(text);
        const results = knowMore.results;

        if (results.length) {
            // Don't draw duplicate tabs beyond the default tabs (i.e. Explanation and Favorite tabs)
            if (drawer.tabs.length > 2) {
                return;
            }
            for (let i in results) {
                this.highlightResults(results[i].title, i);
                knowMore.createTab(results[i], i);
            }
        }
    }

    preLoadImage(forceHighDef = false) {
        const delayForHdLoad = 3000;
        const Img = new Image();
        const quality = {
            text: 'HD',
            title: 'High Definition Image',
        };

        if (!/(jpg|jpeg|png|gif)$/i.test(this.hdurl)) {
            Img.src = this.url;
            quality.text = 'SD';
            quality.title = 'Click to Show HD Image';
        } else {
            Img.src = this.hdurl;
        }

        const timeout = setTimeout(() => {
            if (!Img.complete && !forceHighDef) {
                Img.src = this.url;
                quality.text = 'SD';
                quality.title = 'Click to Show HD Image';
            }
        }, delayForHdLoad);

        Img.onload = () => {
            clearTimeout(timeout);
            this.loadedImage = Img;
            this.apodImage(quality);
        };

        Img.onerror = () => {
            clearTimeout(timeout);
            console.log('Error: image load');
            this.isRequestInProgress = false;
            this.random();
        };
    }

    apodImage(imgQuality) {
        this.isRequestInProgress = false;
        apodImage.classList = 'apod__image';
        imgQualityEl.classList.remove('spin-loader');

        apodImage.style['background-image'] = 'url(' + this.loadedImage.src + ')';
        apodImage.classList.add(`bg-${this.backgroundSize()}`);

        imgQualityEl.textContent = imgQuality.text;
        imgQualityEl.setAttribute('title', imgQuality.title);

        if (imgQuality.text !== 'HD') {
            const forceLoadHighDefImg = e => {
                loadHiResEl.classList.add('hide');
                loadHiResEl.removeEventListener('click', forceLoadHighDefImg);
                imgQualityEl.textContent = '';
                imgQualityEl.classList.add('spin-loader');
                this.preLoadImage(true);
            };
            loadHiResEl.classList.remove('hide');
            loadHiResEl.addEventListener('click', forceLoadHighDefImg);
        }

        this.apodDescription();
    }

    apodVideo() {
        this.isRequestInProgress = false;
        this.url = this.url.replace(';autoplay=1', '');
        const url = new URL(this.url);
        url.search = 'autopause=1&autoplay=0';
        apodVideoFrame.src = url.href;
        this.apodDescription();
    }

    apodDescription() {
        apodTitle.textContent = this.title;
        apodDate.textContent = DateManager.prettyDateFormat(this.date);
        this.wouldYouLikeToKnowMore(this.title + ' ' + this.explanation);

        if (!DateManager.isInPast(this.date)) {
            console.log(date + ' is in the future!');
            this.isRequestInProgress = false;
            this.current();
        } else if (DateManager.isToday(this.date)) {
            apodCurrent.el.classList.add('current');
            apodNext.el.classList.add('hide');
        } else {
            apodNext.el.classList.remove('hide');
            apodCurrent.el.classList.remove('current');
        }

        apodLoading.classList.add('hide');
        $('.apod__header .description').classList.remove('hide');
    }

    /**
     * Build filename for APOD site: ap170111.html
     *
     * @return {String} "2011-02-15"
     */
    apodSource() {
        const date = this.date.split('-');
        return 'ap' + date[0].slice(-2) + zeroPad(date[1]) + zeroPad(date[2]) + '.html';
    }
}

export default Apod;
