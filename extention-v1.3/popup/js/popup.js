$(document).ready(function() {

    $('#submit').click(function(even) {

        var countryCode = $.trim(countryCodes[$("select[name=country").val()]);
        var degree = $.trim(degrees[$("select[name=education").val()]);
        var query = "";
        var queryString = "";

        if($('input[name=keywords]').val().trim() != ""){
            query = query + $('input[name=keywords]').val().trim();
        }

        if($('input[name=jobTitle]').val().trim() != ""){
            if ($.trim(query) != ""){
                query = query + "," + $('input[name=jobTitle]').val().trim();
            }
            else {
                query = $('input[name=jobTitle]').val().trim();
            }
        }

        if(query != ""){
            var queryString = query.split(",").map(
                function(current) {
                    return '"' + $.trim(current).replace(/ /g, "+") + '"'
                }
            ).join("+");
        }

        var url = 'http://www.google.com/search?q=' + queryString + '-intitle:"profiles" -inurl:"dir/+"+site:' + countryCode + 'linkedin.com/in/+OR+site:' + countryCode + 'linkedin.com/pub/' + degree;

        var tabQuery = { active: true, currentWindow: true };
        chrome.tabs.query(tabQuery, function(tabs) {
            chrome.tabs.update(tabs[0].id, {url: url});
        });
    })
})