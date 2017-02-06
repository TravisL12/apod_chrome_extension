'use strict';

let DateManagement = function () {

    const _monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    /**
     * Formats the Date "2017-01-31"
     *
     * @param  {Date}
     * @return {string}
     */
    function _hyphenDateFormat (date) {
        date = date || new Date();
        return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'); 
    }

    /**
     * Gives the actual date (with timezone) at midnight
     *
     * @param  {string} date
     * @return {Date}
     */
    function _actualDate (date) {
        let split = date.split('-');
        return new Date(split[0], split[1]-1, split[2]);
    }

    return {

        get today () {
            return _hyphenDateFormat(_actualDate(_hyphenDateFormat()));
        },

        prettyDateFormat (date) {
            date = _actualDate(date);
            return _monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
        },

        previousDate (dateString) {
            let date = _actualDate(dateString);
            let yesterday = new Date(date.getTime());
            yesterday = new Date(yesterday.setDate(yesterday.getDate() - 1));
            return _hyphenDateFormat(yesterday);
        },

        nextDate (dateString) {
            let date = _actualDate(dateString);
            let tomorrow = new Date(date.getTime());
            tomorrow = new Date(tomorrow.setDate(tomorrow.getDate() + 1));
            return _hyphenDateFormat(tomorrow);
        },

        randomDate () {
            let start = new Date(1995, 5, 16);
            let end = new Date();

            let date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
            return _hyphenDateFormat(date);
        },

        isDateValid (date) {
            if (!date) {
                return true;
            }
            let isDateGreater = new Date(this.today) >  _actualDate(date);
            let isDateEqual   = new Date(this.today) == _actualDate(date);
            
            isDateGreater || isDateEqual ? apodNext.addClass('hide') : apodNext.removeClass('hide');

            return isDateGreater || isDateEqual;
        },

    }

};
