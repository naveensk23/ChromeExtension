var qLead ={};

qLead.data ={};

var showRegisterDialog = function(message) {
	vex.dialog.open({
		message: message + 'Enter a username and password to create a new account',

		input: "<label>Username</label>\n" +
		"<input name=\"username\" type=\"email\" placeholder=\"Create Username\" value=\"\" required />\n" +
		"<label>Password</label>\n" +
		"<input name=\"password\" type=\"password\" class=\"vex-field\" placeholder=\"Create Password\" required oninput=\"this.setCustomValidity((form.password.value.length < 8) ? 'The password must be atleast 8 characters long' : '')\" />\n" +
		"<label>Password Confirmation</label>\n" +
		"<input name=\"confirm_password\" type=\"password\" class=\"vex-field\" placeholder=\"Retype Password\" required oninput=\"this.setCustomValidity((form.password.value != form.confirm_password.value) ? 'This field should match the password field' : '')\" />",

	    buttons: [
	    	$.extend({}, vex.dialog.buttons.YES, {text: 'Create Account'}),
	    	$.extend({}, vex.dialog.buttons.NO, {text: 'Cancel'})
	    ],

	    className: 'vex-theme-bottom-right-corner',

	    callback: function(data) {

			if (data === false) {
				return false;
			}

			vex.showLoading();
			chrome.runtime.sendMessage({type:"CREATE_ACCOUNT", user: { email: data.username, password : data.password} });
			return true;
		}
	})
};

var showLoginDialog = function(message) {
	vex.hideLoading();
	vex.dialog.open({
		message: message + 'Please Login to continue or <a id="register" href="#">Create a new account</a>',

		input: "<label>Username</label>\n" +
		"<input name=\"username\" type=\"email\" placeholder=\"Enter Username\" value=\"\" required />\n" +
		"<label>Password</label>\n" +
		"<input name=\"password\" type=\"password\" class=\"vex-field\" placeholder=\"Enter Password\" required />",

        buttons: [
        	$.extend({}, vex.dialog.buttons.YES, {text: 'Login'}),
        	$.extend({}, vex.dialog.buttons.NO, {text: 'Cancel'})
        ],

        className: 'vex-theme-bottom-right-corner',

        callback: function(data) {

			if (data === false) {
				return false;
			}

			var username = data.username;
			var password = data.password;

			vex.showLoading();
			chrome.runtime.sendMessage({type:"LOGIN", user: { email: username, password : password} });
		},
	})
};

qLead.loadPersonDetails = function() {

	var _this = this;

	var overview = $('div#top-card .profile-overview-content');

	_this.data.profileType = 'PERSON';

	_this.data.name = $('div#name span.full-name').text();
	_this.data.id = overview.find('div.masthead').attr('id').split('-')[1];

//console.log(overview.find('div.masthead').attr('id').split('-')[1]);
	
	_this.data.profileUrl = $('div#top-card div.profile-actions ul li dl dd a')
		.attr('href');

	var contactInfo = $('div#contact-info-section table');

	_this.data.email = contactInfo.find('div#email').text();
	_this.data.phone = contactInfo.find('div#phone').text();

	_this.data.company = {url : null, name: null};

 	_this.data.skills =  $('div#profile-skills ul.skills-section span.skill-pill span.endorse-item-name a')
		.map(function(){ return [$(this).text()] }).get();

	//. get() to get the array object instead of the jquery object returned from map

	_this.data.experience = [];

	$('div#background-experience').children('div').each(function(index) {
		var self = $(this);

		var experience = {}

		experience.title = self.find('header h4 a').text();
//console.log(experience.title);
		experience.company = self.find('header h5 a').text();
		experience.period = {
			to : self.find('span.experience-date-locale time').last().text(),
			from : self.find('span.experience-date-locale time').first().text()
		}

		if (self.hasClass('current-position')){
			experience.period.to = 'Present';

			if (index == 0){
				_this.data.company.name = experience.company;

				var companyLink = self.find('header h5 a')

				if (companyLink.length > 0){
					companyLink = companyLink.last();
					if (/^\/company\/\d+/.test(companyLink.attr('href'))){
						_this.data.company.url = 'https://www.linkedin.com/' + companyLink.attr('href');
						_this.data.company.companyId = _this.data.company.url.match(/\/company\/(\d+)\?/)[1];
					} else if (/^http(?:s)?:\/\/[a-z]{2,3}.linkedin.[a-z]{2,3}\/company\/\d+/.test(companyLink.attr('href'))) {
						_this.data.company.url = companyLink.attr('href');
						_this.data.company.companyId = _this.data.company.url.match(/\/company\/(\d+)\?/)[1];
					}
				}
			}
		}

		_this.data.experience.push(experience);
	})

	_this.data.education = [];

	$('div#background-education').children('div').each(function() {
		var self = $(this);

		var education = {}

		education.school = self.find('header h4').text();
console.log(education.school);
		education.degree = self.find('header h5 span.degree').text();
		education.major = self.find('header h5 span.major').text();

		education.period = {
			to : self.find('span.education-date time').last().text().replace(/[^0-9]/, '').trim(),
			from : self.find('span.education-date time').first().text()
		}

		_this.data.education.push(education);
	})

	if( $("div.profile-picture img").length > 0){

		var img = new Image();
		img.setAttribute('crossOrigin', 'anonymous');
		img.src = $('div.profile-picture img').attr('src');

		img.onload = function() {

	        var canvas = document.createElement("canvas");
	        canvas.width = this.width;
	        canvas.height = this.height;

	        var ctx = canvas.getContext("2d");
	        ctx.drawImage(this, 0, 0);

	        var blob = canvas.toDataURL('image/png');
	        _this.data.image = blob;
	        qLead.loadPersonCompanyData();
	    };
	}
	else {
		qLead.loadPersonCompanyData();
	}
};

qLead.showPersonDetails = function() {
	vex.hideLoading();

	_this = this;

	delete _this.data.company.url

	var input = '';

	if (_this.data.image){
		input += "<img src=\"" + _this.data.image + "\"/>";
	}

	input += "<label>Name</label>\n" +
		"<input name=\"name\" type=\"text\" placeholder=\"Enter name here\" value=\"" + _this.data.name + "\" required />\n";

	input += "<label>Current Company</label>\n" +
		"<input name=\"currentCompany\" type=\"text\" placeholder=\"Enter Current Company Name\" value=\"" + _this.data.company.name + "\" />";

	input += "<label>Phone</label>\n" +
		"<input name=\"phone\" type=\"text\" placeholder=\"Enter Phone Number\" value=\"" + _this.data.phone + "\" />";

	input += "<label>Email</label>\n" +
		"<input name=\"email\" type=\"text\" placeholder=\"Enter Email\" value=\"" + _this.data.email + "\" />";


	vex.dialog.open({
		message: '',

		input: input,

        buttons: [
        	$.extend({}, vex.dialog.buttons.YES, {text: 'SAVE'}),
        	$.extend({}, vex.dialog.buttons.NO, {text: 'Cancel'})
        ],

        className: 'vex-theme-bottom-right-corner person-details',


        callback: function(data) {


			if (data === false) {
				return false;
			}


			qLead.data.name = data.name;
			qLead.data.phone = data.phone;
			qLead.data.email = data.email;
			qLead.data.company.name = data.currentCompany;

			vex.showLoading();
			chrome.runtime.sendMessage({type:"SAVE_PERSON", user: qLead.data});
console.log(qLead.data);
		},
	})
};

qLead.loadPersonCompanyData = function() {
	var _this = this;

	if (_this.data.company.url){
		var getCompanyData = $.get( _this.data.company.url, function( data ) {
	  		var about = $(data).find('div.basic-info-about')
	  		_this.data.company.name = $(data).find('div.header div.left-entity h1.name').text().trim();
	  		_this.data.company.website = about.find('li.website a').text();
	  		_this.data.company.industry = about.find('li.industry p').text();
	  		_this.data.company.type = about.find('li.type p').text().trim();

	  		_this.data.company.address = {};

	  		about.find('li.vcard p span').each(function() {
	  			var self = $(this);
	  			var i = '';

	  			if (_this.data.company.address[self.attr('itemprop')]){
	  				i = 1;
	  			}

	  			_this.data.company.address[self.attr('itemprop') + i] = self.text();
	  		})

	  		_this.data.company.size = about.find('li.company-size p').text().trim();
	  		_this.data.company.founded = about.find('li.founded p').text();
		});

		getCompanyData.done(function() {
			_this.showPersonDetails();
		})
	}
	else {
		_this.showPersonDetails();
	}
};

qLead.showCompanyDetails = function() {
	_this = this;
	vex.hideLoading();

	var input = "";

	if (_this.data.image){
		input += "<img src=\"" + _this.data.image + "\"/>";
	}

	if (_this.data.name){
		input += "<label>Name</label>\n" +
		"<input name=\"name\" type=\"text\" placeholder=\"Company Name\" value=\"" + _this.data.name + "\" />\n";
	}

	if (_this.data.website){
		input += "<label>Website</label>\n" +
		"<input name=\"currentCompany\" type=\"text\" placeholder=\"Enter Company Website\" value=\"" + _this.data.website + "\" />";
	}

	if (_this.data.industry){
		input += "<label>Industry</label>\n" +
		"<input name=\"phone\" type=\"text\" placeholder=\"Enter Industry\" value=\"" + _this.data.industry + "\" />";
	}

	if (_this.data.founded){
		input += "<label>Founded</label>\n" +
		"<input name=\"phone\" type=\"text\" placeholder=\"Enter Founded Year\" value=\"" + _this.data.founded + "\" />";
	}

	if (_this.data.size){
		input += "<label>size</label>\n" +
		"<input name=\"email\" type=\"text\" placeholder=\"Enter Company Size\" value=\"" + _this.data.size + "\" />";
	}

	vex.dialog.open({
		message: '',

		input: input,

        buttons: [
        	$.extend({}, vex.dialog.buttons.YES, {text: 'SAVE'}),
        	$.extend({}, vex.dialog.buttons.NO, {text: 'Cancel'})
        ],

        className: 'vex-theme-bottom-right-corner company-details',

        callback: function(data) {

			if (data === false) {
				return false;
			}

			qLead.data.name = data.name;
			qLead.data.website = data.website;
			qLead.data.industry = data.industry;
			qLead.data.founded = data.founded;
			qLead.data.size = data.size;

			vex.showLoading();
			chrome.runtime.sendMessage({type:"SAVE_COMPANY", user: qLead.data});
			console.log(qLead.data);
		}
	})
};

qLead.loadCompanyDetails = function() {
	_this = this;

	_this.data.profileType = 'COMPANY';

	_this.data.url = document.URL;

	if (_this.data.url.match(/\/company\/(\d+)\?/)){
		_this.data.companyId =  _this.data.url.match(/\/company\/(\d+)\?/)[1];
	}

	_this.data.name = $('div.header div.left-entity h1.name').text().trim();

	var about = $('div.basic-info-about')
	_this.data.website = about.find('li.website a').text();
	_this.data.industry = about.find('li.industry p').text();
	_this.data.type = about.find('li.type p').text().trim();

	_this.data.address = {};

	about.find('li.vcard p span').each(function() {

		var self = $(this);
		var i = '';

		if (_this.data.address[self.attr('itemprop')]){
			i = 1;
		}

		_this.data.address[self.attr('itemprop') + i] = self.text();
	})

	_this.data.size = about.find('li.company-size p').text().trim();
	_this.data.founded = about.find('li.founded p').text();

	if( $("div.top-bar div.header div.image-wrapper img").length > 0){

		var img = new Image();
		img.setAttribute('crossOrigin', 'anonymous');
		img.src = $("div.top-bar div.header div.image-wrapper img").attr('src');

		img.onload = function() {

	        var canvas = document.createElement("canvas");
	        canvas.width = this.width;
	        canvas.height = this.height;

	        var ctx = canvas.getContext("2d");
	        ctx.drawImage(this, 0, 0);

	        var blob = canvas.toDataURL('image/png');
	        _this.data.image = blob;
	        _this.showCompanyDetails();
	    };
	}
	else {
		_this.showCompanyDetails();
	}
};

var addPerson = $('<a href="#" class="button-primary btn-add-person btn-linkedin">Add To</a>')

addPerson.click(function(e) {
	e.preventDefault();
	vex.showLoading();
	qLead.loadPersonDetails();
});

var addCompany = $('<a href="#" class="button-primary btn-add-company btn-linkedin">Add To</a>')

addCompany.click(function(e) {
	e.preventDefault();
	vex.showLoading();
	qLead.loadCompanyDetails();
});

$(document).ready(function() {

	$(document).on('click','.vex-dialog-form #register',function(){
		vex.close();
		showRegisterDialog('');
	});

	chrome.runtime.onMessage.addListener(function (request) {
	    switch(request.type) {

	        case "SAVE_SUCCESS":
	        	vex.hideLoading();
		        qLead.data = {};
				vex.dialog.alert({
					message: 'The details have been successfully saved.',
					className: 'vex-theme-bottom-right-corner'
				});
	        break;

	        case "ERROR_MESSAGE":
	        	vex.hideLoading();
				vex.dialog.alert({
					message: request.message,
					className: 'vex-theme-bottom-right-corner'
				});
	        break;

	        case "NOT_LOGGED_IN":
				showLoginDialog('It seems you are not logged into Qlead.<br>');
	        break;

	        case "ACCOUNT_EXISTS":
	        	vex.hideLoading();
				showRegisterDialog('An account with that name already exists.<br>');
	        break;

	        case "LOGIN_SUCCESS":
				if (qLead.data.profileType == 'PERSON'){
					chrome.runtime.sendMessage({type:"SAVE_PERSON", user: qLead.data});
				}
				else {
					chrome.runtime.sendMessage({type:"SAVE_COMPANY", user: qLead.data});
				}
	        break;

	       case "LOGIN_ERROR":
	       		showLoginDialog('Your username or password was wrong.<br>');
	        break;
	    }
	});

	$('body#pagekey-nprofile_view_nonself .profile-card.vcard').append(addPerson);
	$('body#pagekey-biz-overview-company-internal div.header').append(addCompany);
})