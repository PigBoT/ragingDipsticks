//there was a problem getting the images to load properly..
//Thank you mr PAEz
//http://stackoverflow.com/questions/13669762/chrome-extention-using-jquery-in-content-script-resolve-error-when-creating-dial


//adds the html of the dialog to the page. This should be removed at a later time.
function addBasicDialogHtml()
{
  $('body').append('<div id="dialog" title="Add Friend"><p>This is the mock dialog for adding a friend</p></div>');
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function addNewFriendHtml()
{
  var div = $('<div />').attr('title', 'Add a new friend').attr('id', 'dialog-form').appendTo('body');
  var validatTips = $('<p />').text('Please fill out the entire user form. Note: Email is optional!').addClass("validateTips").appendTo(div);
  
  var form = $('<form />').appendTo(div);
  var fieldSet = $('<fieldset />').appendTo(form);
  
  //name
  var name = $('<label />').text('Name').css('display', 'block').appendTo(fieldSet);
  var nameInput = $('<input />', {type: 'text', name: 'name', id: 'name', 'class': 'text ui-widget-content ui-corner-all'}).text('Enter name').css('display', 'block').appendTo(fieldSet);
  
  //email
  var email = $('<label />').text('Email (optional)').css('display', 'block').appendTo(fieldSet);
  var emailInput = $('<input />', {type: 'text', name: 'email', id: 'email', 'class': 'text ui-widget-content ui-corner-all'}).css('display', 'block').appendTo(fieldSet);
  
  //publicKey
  var publicKey = $('<label />').text('Public key of Friend').css('display', 'block').appendTo(fieldSet);
  var publicKeyTextarea = $('<textarea />', {type: 'text', name: 'publicKey', id: 'publicKey', 'class': 'text ui-widget-content ui-corner-all'}).text('private key').css('display', 'block').appendTo(fieldSet);
  
  //allFields = $( [] ).add( nameInput ).add( emailInput ).add( publicKeyTextarea ),
}

function addBasicPopDialog()
{
  $('#dialog').dialog();
}

function parseFriends(friendsJson)
{
  console.log('passed friends json ' + friendsJson);
  var friendsParsed = JSON.parse(friendsJson);
  console.log('parsed friends json ' + friendsParsed);
  $.each(friendsParsed, function(key, value){
				console.log(key);
				console.log(value);
			});
  
}

//this came from http://jqueryui.com/dialog/#modal-form
function initAddFriendForm() {
  var name = $( "#name" ),
    email = $( "#email" ),
    publicKey = $( "#publicKey" ),
    allFields = $( [] ).add( name ).add( email ).add( publicKey ),
    tips = $( ".validateTips" );

  function updateTips( t ) {
    tips
      .text( t )
      .addClass( "ui-state-highlight" );
    setTimeout(function() {
      tips.removeClass( "ui-state-highlight", 1500 );
    }, 500 );
  }

  function checkLength( o, n, min, max, required) {
    //special case to check if the value is required or if the value is greater then zero
    if( (required) || (o.val().length))
    {    
      console.log("length of field: " + o.val().length);
      
      if ( o.val().length > max || o.val().length < min ) {
        o.addClass( "ui-state-error" );
        updateTips( "Length of " + n + " must be between " +
          min + " and " + max + "." );
        return false;
      } else {
        return true;
      }
    }
    
    //if the value is not required 
    //and there is no input 
    return true;
  }

  function checkRegexp( o, regexp, n, required) {
    //only perform check if there is a value entered in for the optional field
    if( (required) || (o.val().length))
    { 
      if ( !( regexp.test( o.val() ) ) ) {
        o.addClass( "ui-state-error" );
        updateTips( n );
        return false;
      } else {
        return true;
      }
    }
    
    //if the value is not required 
    //and there is no input 
    return true;
    
  }
  
  function loadFriends()
  {
  
    var msgPort = chrome.runtime.connect({name: "load_friends"});
    msgPort.postMessage({});
    
    msgPort.onMessage.addListener(function(msg) {
      var friends = msg.keys;
      console.log('response: ' + friends);
      parseFriends(friends);
    });   
  }
  
  $('#dialog-form').dialog({
    autoOpen: false,
    height: 450,
    width: 450,
    modal: true,
    buttons: {
      "Add new friend": function() {
        var bValid = true;
        allFields.removeClass( "ui-state-error" );
        
        //this defines if the field is valid, and is between a specific length
        //ex. Name has to be between 3 and 16 digits
        bValid = bValid && checkLength( name, "username", 3, 16, true );
        bValid = bValid && checkLength( email, "email", 6, 80, false );
        bValid = bValid && checkLength( publicKey, "publicKey", 5, 16, true);
        
        //regex for field validations
        bValid = bValid && checkRegexp( name, /^[a-z]([0-9a-z_])+$/i, "Username may consist of a-z, 0-9, underscores, begin with a letter.", true);
        // From jquery.validate.js (by joern), contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
        bValid = bValid && checkRegexp( email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "eg. ui@jquery.com", false);
        
        //not sure what validation should occur for the private key
        //bValid = bValid && checkRegexp( publicKey, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" , true);

        if ( bValid ) {
        
          //This is where the logic will go to add a new user
          console.log("Adding a new friend '" + name.val() + "' with email of '" + email.val() + "' and public key of '" + publicKey.val() + "'");
          
          var newFriendStore = new Array();
          newFriendStore.push({'name': name.val(), 'email': email.val(), 'publicKey': publicKey.val()});
          var newFriendStoreString = JSON.stringify(newFriendStore);
          console.log("json:" + newFriendStoreString);
          
          //send to storage
          chrome.runtime.connect({name : 'save_friends'}).postMessage({keys: newFriendStoreString});
          
          loadFriends();
          
          $( this ).dialog( "close" );
        }
      },
      Cancel: function() {
        $( this ).dialog( "close" );
      }
    },
    close: function() {
      allFields.val( "" ).removeClass( "ui-state-error" );
    }
  });
}

function addNewFriendDialog()
{
  addNewFriendHtml();
  initAddFriendForm();
  $( "#dialog-form" ).dialog( "open" ).zIndex(8983453543);
  $( ".ui-dialog" ).zIndex(99999);
  $( ".ui-widget-overlay" ).zIndex(99999);
}


function addSelectFriendHtml()
{
  var div = $('<div />').attr('title', 'Select a friend').attr('id', 'select-friend').appendTo('body');
  var validatTips = $('<p />').text('Select your friend').appendTo(div);
  
  var table = $('<table />').attr('id', 'select-friend').appendTo(div);
  var trFriend = $('<th />').text("friend").appendTo(table);
  var trEmail = $('<th />').text("email").appendTo(table);
}

function initSelectFriendDialog()
{
$('#select-friend').dialog({
    autoOpen: false,
    height: 450,
    width: 450,
    modal: true,
  });
}

function addSelectFriendDialog()
{
  addSelectFriendHtml();
  initSelectFriendDialog();
  $( "#select-friend" ).dialog( "open" );
  $( ".ui-dialog" ).zIndex(99999);
  $( ".ui-widget-overlay" ).zIndex(99999);
}




