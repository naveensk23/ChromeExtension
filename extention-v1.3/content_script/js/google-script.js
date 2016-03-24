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


qLead.loadPersonDetails = function(data) {//data has linked in profile

	var _this = this;
	var dom = $(data);

	var overview = dom.find('div.profile-overview-content'); //#top-card 

	//_this.data.name = dom.find('div#name span.full-name').text();
	
_this.data.name = null;	
	if(dom.find('h1#name').text()){
		_this.data.name = dom.find('h1#name').text();
	}
console.log(dom.find('h1#name').text());

_this.data.id = null;

if(overview.find('div.masthead').attr('id')){
	_this.data.id = overview.find('div.masthead').attr('id').split('-')[1];
}	

	var contactInfo = dom.find('div#contact-info-section table');

	
	_this.data.email = contactInfo.find('div#email').text();
	
//console.log("hello_1 %s",(dom.find('div#email').text()));
	
	
	_this.data.phone = contactInfo.find('div#phone').text();
	
//console.log("hello_2 %s",(dom.find('div#phone').text()));	

	_this.data.company = {url : null, name:""};
	
//console.log({url : null, name:""});

 	_this.data.skills =  dom.find('div#profile-skills ul.skills-section span.skill-pill span.endorse-item-name a')
		.map(function(){ return [$(this).text()] }).get();
		

	//. get() to get the array object instead of the jquery object returned from map

	_this.data.experience = [];
	
	

	/*dom.find('div#background-experience').children('div').each(function(index) {
		var self = $(this);

		var experience = {}

		experience.title = self.find('header h4 a').text();
		experience.company = self.find('header h5').text();
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
	})*/
	

_this.data.company.CurrentPosition = null;	

if(dom.find("li[data-section='currentPositions'] h4.item-title").text()){
	_this.data.company.CurrentPosition = dom.find("li[data-section='currentPositions'] h4.item-title").text(); //krushi 
}
console.log("\n===>",_this.data.company.CurrentPosition,"\n");

_this.data.company.name = null;	

if(dom.find('span.org ').text()){
	_this.data.company.name = dom.find('span.org ').text(); //krushi 
}
console.log("\n===>",_this.data.company.name,"\n");

_this.data.company.PastPosition = null;

if(dom.find("li[data-section='pastPositions'] h4.item-title").text()){
	_this.data.company.PastPosition = dom.find("li[data-section='pastPositions'] h4.item-title").text(); //krushi 
}
console.log("\n===>"+_this.data.company.PastPosition+"\n");

_this.data.company.PastCompany = null;

if(dom.find("li[data-section='pastPositions'] h5.item-subtitle").text()){
	_this.data.company.PastCompany = dom.find("li[data-section='pastPositions'] h5.item-subtitle").text(); //krushi 
}
console.log("\n===>"+_this.data.company.PastCompany+"\n");


/*_this.data.experience = null;
if(dom.find('ul.positions ').text()){
	_this.data.experience= dom.find('ul.positions ').text(); //krushi 
}

console.log(dom.find('ul.positions ').text());

_this.data.ExtraInfo=null;

if(dom.find('table.extra-info').text()){
_this.data.ExtraInfo= dom.find('table.extra-info').text();
}
console.log(dom.find('table.extra-info').text());
*/

	_this.data.education = [];

	dom.find('div#background-education').children('div').each(function() {
		var self = $(this);

		var education = {}

		education.school = self.find('header h4').text();
		education.degree = self.find('header h5 span.degree').text();
		education.major = self.find('header h5 span.major').text();

		education.period = {
			to : self.find('span.education-date time').last().text().replace(/[^0-9]/, '').trim(),
			from : self.find('span.education-date time').first().text()
		}

		_this.data.education.push(education);
	})

	if (_this.data.company.url){
		// console.log('msg to get company data');
		chrome.runtime.sendMessage({
			type:"GET_COMPANY_DATA",
			url: _this.data.company.url
		});
	}
	else {
		_this.showPersonDetails();
	}
};

qLead.loadCompanyData = function(data) {
	var _this = this;

	var about = $(data).find('div.basic-info-about')
	
	_this.data.company.name = $(data).find('div.header h1.name').text().trim();
	
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
	_this.showPersonDetails();
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

        	console.log('data is', data);

			if (data === false) {
				return false;
			}

			qLead.data.name = data.name;
			qLead.data.phone = data.phone;
			qLead.data.email = data.email;
			qLead.data.company.name = data.currentCompany;

			vex.showLoading();
			chrome.runtime.sendMessage({type:"SAVE_PERSON", user: qLead.data});
		}
	})
};

var addPerson = $('<a href="#" class="button-primary btn-add-person queuelead">Add To</a>')

addPerson.click(function(e) {
	e.preventDefault();
	qLead.data.profileUrl = $(this).parent().find('div.s cite').text();
	vex.showLoading();
console.log("hello %s",$(this).parent().find('div.s cite').text());
	chrome.runtime.sendMessage({type:"GET_PROFILE_DATA", url: $(this).parent().find('div.s cite').text()});
});

function DOMModificationHandler(){
    $(this).unbind('DOMSubtreeModified');
    setTimeout(function(){
        $('div#search div#rso div.srg').find('div.g').each(function() {
        	if ($(this).find('a.queuelead').length < 1 && /^http(s)?:\/\/[a-z]{2,3}.linkedin.[a-z]{2,3}\/?(?:(?:in\/(?:\w|\d|-)+\/?)|(?:pub\/(?:\w|\d|-)*\/(?:(?:\w|\d)+\/?){3}))$/.test($(this).find('div.rc div.s cite._Rm').text()) ){
				addPerson.clone(true).appendTo($(this));
        	}
		})
        $('div#search').bind('DOMSubtreeModified',DOMModificationHandler);
    },300);
}

$('div#search').bind('DOMSubtreeModified',DOMModificationHandler);

$(document).ready(function() {

	$('div#search ol#rso div.srg').find('div.g').each(function() {
    	if ($(this).find('a.queuelead').length < 1 && /^http(s)?:\/\/[a-z]{2,3}.linkedin.[a-z]{2,3}\/?(?:(?:in\/(?:\w|\d|-)+\/?)|(?:pub\/(?:\w|\d|-)*\/(?:(?:\w|\d)+\/?){3}))$/.test($(this).find('div.rc div.s cite._Rm').text()) ){
			addPerson.clone(true).appendTo($(this));
    	}
	})

	$(document).on('click','.vex-dialog-form #register',function(){
		vex.close();
		showRegisterDialog('');
	});

	chrome.runtime.onMessage.addListener(function (request) {
	    switch(request.type) {

	    	case "GOT_PROFILE":
	        	qLead.loadPersonDetails(request.dom);
				
	        case "GOT_COMPANY":
	        	qLead.loadCompanyData(request.dom);
				
	        break;

	        case "SAVE_SUCCESS":
	        	vex.hideLoading();
		        vex.close();
		        qLead.data = {};
				vex.dialog.alert({
					message: 'The details have been successfully saved.',
					className: 'vex-theme-bottom-right-corner'
				});
	        break;

	        case "ERROR_MESSAGE":
	        	console.log(request.xhr);
		        vex.close();
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
		        vex.close();
				chrome.runtime.sendMessage({type:"SAVE_PERSON", user: qLead.data});
	        break;

	        case "LOGIN_ERROR":
		        showLoginDialog('Your username or password was wrong.<br>');
	        break;
	    }
	});
})
