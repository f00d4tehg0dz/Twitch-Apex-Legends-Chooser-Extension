let token = '';
let tuid = '';

const twitch = window.Twitch.ext;

// create the request options for our Twitch API calls
const requests = {
  set: createRequest('POST', 'cycle'),
  get: createRequest('GET', 'query')
};

function createRequest (type, method) {
  return {
    type: type,
    url: location.protocol + '//localhost:8081/color/' + method,
    success: updateBlock,
    error: logError
  };
}

function setAuth (token) {
  Object.keys(requests).forEach((req) => {
    twitch.rig.log('Setting auth headers');
    requests[req].headers = { 'Authorization': 'Bearer ' + token };
  });
}

twitch.onContext(function (context) {
  twitch.rig.log(context);
});

twitch.onAuthorized(function (auth) {
  // save our credentials
  token = auth.token;
  tuid = auth.userId;

  // enable the button
  $('#cycle').removeAttr('disabled');

  setAuth(token);
  $.ajax(requests.get);
});

function updateBlock (hex) {
  twitch.rig.log('Updating');
  // $('#color').css('background-color', hex);


  }




function logError(_, error, status) {
  twitch.rig.log('EBS request returned '+status+' ('+error+')');
}

function logSuccess(hex, status) {
  twitch.rig.log('EBS request returned '+hex+' ('+status+')');
}

$(function () {
  // when we click the cycle button
  $('#increment').click(function () {
  if(!token) { return twitch.rig.log('Not authorized'); }
    twitch.rig.log('Requesting random cycle');
    function highlightCards(elm, i) {
      elm.style.opacity = '1';
      setTimeout(function() {
        elm.style.opacity = '.5';
        setTimeout(function() {
          elm.style.opacity = '1';
        }, 50 * i);
      }, 300 * i);
    }

    var columnID = document.querySelectorAll('#column');
    Array.prototype.forEach.call(columnID, function(e, i) {
      highlightCards(columnID[i], i);


      console.log('hey')
    });

    setTimeout(function() {
      var divs = $("div#column").get().sort(function() {
        return Math.round(Math.random()) - 0.5; //random so we get the right +/- combo
      }).slice(0, 4)
      var randomitem = (divs[0]);
      //console.log(randomitem)

      $(randomitem).css("opacity", ".5");
      //console.log($(randomitem.children).attr('data-function'))
      var finalAttr = $(randomitem.children).attr('data-function');
      var finalOne = ($('#finalOne')).val(finalAttr);
      const finalCount = document.querySelector('#finalOne').value;
      // sdk.loaded().then(() => {
      //   sdk.send('finalOne', {
      //     finalCount: finalCount
      //   });
      // });
    }, 2500);
    // $.ajax(requests.set);
  });
});
