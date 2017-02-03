let DateManagement = function () {

    const _monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    function _hyphenDateFormat (date) {
        date = date || new Date();
        return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'); 
    };

    return {

        actualDate (date) {
            let split = date.split('-');
            return new Date(split[0], split[1]-1, split[2]);
        },

        prettyDateFormat (date) {
            let thisDate = this.actualDate(date);
            return _monthNames[thisDate.getMonth()] + ' ' + thisDate.getDate() + ', ' + thisDate.getFullYear();
        },

        previousDate (dateString) {
            let date = this.actualDate(dateString);
            let yesterday = new Date(date.getTime());
            yesterday = new Date(yesterday.setDate(yesterday.getDate() - 1));
            return _hyphenDateFormat(yesterday);
        },

        nextDate (dateString) {
            let date = this.actualDate(dateString);
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

        checkDate (date) {
            let today = this.actualDate(_hyphenDateFormat());

            if (this.actualDate(date) > today) {
                apodNext.addClass('hide');
                return false;
            } else if (this.actualDate(date) >= today) {
                apodNext.addClass('hide');
            } else {
                apodNext.removeClass('hide');
            }

            return true;
        },

    }

};
