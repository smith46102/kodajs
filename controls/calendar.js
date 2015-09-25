
function GuiCalendar(dom, gui, options) {
	this.construct(dom, gui, options);
}

Gui.extend(GuiCalendar, GuiElement, {

	monthLabels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
	shortMonthLabels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
	daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	date: '',
	day: 0,
	month: 0,
	year: 0,


	/**
	 * Construct calendar, bind events to buttons
	 */
	construct: function(dom, gui, options) {
		this.__inherit.construct.apply(this, arguments);
		var _this = this;

		this.nextButton = this.dom.findOne('.js-calendar-next');
		this.nextButton.bind('click', function() { _this.switchMonth.call(_this, 1) });
		this.prevButton = this.dom.findOne('.js-calendar-prev');
		this.prevButton.bind('click', function() { _this.switchMonth.call(_this, -1) });
		this.body = this.dom.findOne('.js-calendar-body');

		// get attr date or current date as start of calendar
		this.date = this.dom.attr('date');
		var date = this.date !== '' ? new Date(this.date) : new Date();
		this.year = date.getFullYear();
		this.month = date.getMonth();
		this.day = date.getDate();

		// render
		this.renderCalendar();

		// fire init event
		this.fire('construct');
	},


	/**
	 * Render calendar body contents and activate Day - events
	 */
	renderCalendar: function() {
		// get first day of month
		var firstDay = new Date(this.year, this.month, 1);
		var startingDay = firstDay.getDay();

		// find number of days in month
		var monthLength = this.daysInMonth[this.month];

		// compensate for leap year
		if (this.month == 1) { // February only!
			if((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0){
				monthLength = 29;
			}
		}

		// do the header
		var html = '<tr class="Calendar-body-line">';

		// fill in the days
		var day = 1;

		var minDate = this.attr('minDate');
		var maxDate = this.attr('maxDate');

		var todayDate = new Date();
		todayDate = this.makeDate(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());

		// this loop is for is weeks (rows)
		for (var i = 0; i < 9; i++) {
			// this loop is for weekdays (cells)
			for (var j = 0; j <= 6; j++) {
				if (day <= monthLength && (i > 0 || j >= startingDay)) {
					var thisDate = this.makeDate(this.year, this.month, day);
					var dayClass = (this.date === thisDate) ? '_active' : '';
					if (thisDate == todayDate) dayClass += ' _today';
					if (minDate) dayClass += (thisDate < minDate) ? ' _disabled' : '';
					if (maxDate) dayClass += (thisDate > maxDate) ? ' _disabled' : '';
					html += '<td class="Calendar-body-num ' + dayClass + ' js-calendar-day">' + day + '</td>';
					day++;
				} else {
					html += '<td class="Calendar-body-num _disabled"></td>';
				}
			}
			// stop making rows if we've run out of days
			if (day > monthLength) {
				break;
			} else {
				html += '</tr><tr class="Calendar-body-line">';
			}
		}
		html += '</tr>';

		this.body.innerHTML = html;
		this.enableDayClicks();
		this.setDateText();
	},


	enableDayClicks: function() {
		var days = this.body.find('.js-calendar-day');
		var _this = this;
		for (var i = 0; i < days.length; i++) {
			days[i].bind('click', function() {
				_this.dayClick.call(_this, this);
				return false;
			})
		}
	},


	setDateText: function() {
		var title = this.dom.findOne('.js-calendar-month');
		title && (title.innerHTML = this.monthLabels[this.month] + ', ' + this.year);
	},


	makeDate: function(year, month, day) {
		var date = new Date(year, month, day);
		var yyyy = date.getFullYear().toString();
		var mm = (date.getMonth()+1).toString();
		var dd  = date.getDate().toString();
		return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
	},


	/**
	 * Click on day-item in calendar body
	 * Makes this day active, set calendar date
	 *
	 * @param HTMLElement day
	 */
	dayClick: function(day) {
		if (day.hasClass('_disabled')) return false;

		var newDay = parseInt(day.innerHTML) || 1;
		var newDate = this.makeDate(this.year, this.month, newDay);

		if (this.fire('change', newDate) !== false) {
			this.day = newDay;
			this.date = newDate;
			var active = this.body.findOne('.js-calendar-day._active');
			active && active.removeClass('_active');
			day.addClass('_active');
		}
		return false;
	},


	/**
	 * Switch month with Next and Prev Button,
	 * then render calendar body
	 *
	 * @param int increment
	 */
	switchMonth: function(increment) {
		var newYear = this.year,
			newMonth = this.month + increment;

		if (newMonth < 0) {
			newMonth = 11;
			newYear -= 1;
		}
		if (newMonth > 11) {
			newMonth = 0;
			newYear += 1;
		}

		if (this.fire('switchMonth', { 'year': newYear, 'month': newMonth }) !== false) {
			this.month = newMonth;
			this.year = newYear;
			this.renderCalendar();
		}
	},


	/**
	 * Clears selected day and calendar value
	 */
	clearDate: function() {
		this.date = '';
		var active = this.body.findOne('.js-calendar-day._active');
		active && active.removeClass('_active');
		this.attr('minDate', '');
		this.attr('maxDate', '');
		this.renderCalendar();
	},


	/**
	 * Get short date format
	 */
	getShortDate: function(date) {
		if (date) {
			var d = new Date(date);
			var month = this.shortMonthLabels[d.getMonth()];
			var day = d.getDate();
			return day + ' ' + month;
		}
		if (this.date) {
			var month = this.shortMonthLabels[this.month];
			return this.day + ' ' + month;
		}
		return null;
	}


});

Gui.registerElement(GuiCalendar, 'calendar');