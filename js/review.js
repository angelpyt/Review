Parse.initialize("TNeLnzoGV0WL1pusAcUfX0n9mxje6iVD9PPzEaDN", "d03cNBjrb2I2iCmrwcuv3t27Bow97rgpNfI2DrbE");

var Review = Parse.Object.extend('Review');

var currentUser = Parse.User.current();

//log user out
$("#out").on("click", function() {
	if (currentUser != null) {
		Parse.User.logOut();
		location.reload();
		alert("You have successfully logged out");
	}
})

//sign up for user
$("#signup").submit(function() {
	var user = new Parse.User();
	user.set("username", $("#upname").val());
	user.set("password", $("#uppassword").val());
	user.set("reviews", [])
	user.signUp(null, {
		success: function(user) {
			Parse.User.logIn($("#upname").val(), $("#uppassword").val(), {
				success: function(user) {
			    document.location.href = "index.html";
			  },
			  error: function(error) {
			    alert("Error: " + error.code + " "+ error.message);
			    clearInput();
			  }
			});
		}
	});
	return false;
});

//sign in for user
$("#signin").submit(function() {
	Parse.User.logIn($("#inname").val(), $("#inpassword").val(), {
		success: function(user) {
			document.location.href = "index.html";
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
			clearInput();	
		}	
	});
	return false;
});

// clears all input
var clear = function() {
	$("#upname").val("");
	$("#uppassword").val("");
	$("#inname").val("");
	$("#inpassword").val("");
}

// var currentUser = Parse.User.current();
// if (currentUser) {
//     // do stuff with the user
// } else {
//     // show the signup or login page
// }


//Rating 
$('#rating').raty();

//click event when write is submitted
$('#write').submit(function() {
	if (currentUser != null) {
		var review = new Review();	
		// $(this).find('input').each(function(){
		// 	review.set($(this).attr('id'), $(this).val());
		// 	$(this).val('');
		// })
		var title = $('#title');
		review.set('title', title.val());
		var content = $('#content');
		review.set('content', content.val());
		var date = new Date();
		review.set('date', date.toDateString());

		review.set('rating', parseInt($('#rating').raty('score')));
		review.set('votes', 0);
		review.set('helpful', 0);
		review.set('user', Parse.User.current());

		review.save(null, {
			success:function() {
				title.val('');
				content.val('');
				$('#rating').raty({score: 0});
				getData();
			}
		})
	} else {
		alert("Sign in to review");
	}
	return false;
})

//write a function to get data
var getData = function() {
	var query = new Parse.Query(Review);
	query.include("user");
	query.find({
		success:function(results) {
			buildList(results);
		} 
	})
}

// a function to build the list
var buildList = function(data) {
	var rating = 0;

	$('#reviewArea').empty();
	data.forEach(function(d){
		rating += d.get('rating');
		addItem(d);
	})
	$("#avgRating").raty({score:rating/(data.length), readOnly: true});
}

//this function takes in an item, adds it to the sreen
var addItem = function(item) {
	//console.log('addItem', item);
	var title = item.get('title');
	var content = item.get('content');
	var rating = item.get('rating');
	var date = item.get('date');
	var votes = item.get('votes');
	var helpful = item.get('helpful');
	var user = item.get('user');

	//var li = $('<li>check' + title + 'out' + content + '</li>');
	//var li = $('<li></li>');
	var div = $('<div class = "well"></div>');
	var Title = $('<div id = "T"></div>');
	Title.text(title);
	var Content = $('<div id = "C"></div>');
	Content.text(content);
	var D = $('<div id = "Date"></div>');
	D.text(" Created on " + date);
	var Rate = $('<div id = "R"></div>');
	Rate.raty({score: rating, readOnly: true});
	var Helpful = $('<div id = "H"></div>');

	var voteUp = $("<button class='voting'><span class='glyphicon glyphicon-thumbs-up'></span></button>");
	var voteDown = $("<button class='voting'><span class='glyphicon glyphicon-thumbs-down'></span></button>");
	var button = $('<button id="button" class="btn-warning btn-xs"><span class="glyphicon glyphicon-remove"></span></button>');
	button.click(function() {
		if (currentUser.id == user.id) {
			item.destroy({
				success:getData
			})
		}
	})

	voteUp.on("click", function() {
		item.set("helpful", helpful +=1);
		item.set("votes", votes += 1);
		item.save();
		getData();
	});

	voteDown.on("click", function() {
		item.set("votes", votes += 1);
		item.save();
		getData();

	});

	if (votes != 0) {
		Helpful.text(helpful + " out of " + votes + " found this review helpful.");
	}

	div.append(Rate);
	div.append(Title);
	div.append(button);
	div.append(voteDown);
	div.append(voteUp);
	div.append(D);
	div.append(Content);
	div.append(Helpful);


	//li.append(button);

	//$('#reviewArea').append(li);
	$('#reviewArea').append(div);

	
}

getData();


