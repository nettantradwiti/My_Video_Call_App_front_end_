// replace these values with those generated in your TokBox Account

$(document).ready(() => {
  // let apiKey = "";
  // let sessionId = "";
  // let token = "";

  $("form").submit((e) => {
    e.preventDefault();

    const value = $("input:text").val();

    if (value == "") {
      return;
    } else {
      fetch("https://videocallserverdwiti.herokuapp.com/api/user", {
        method: "POST",
        // The data

        body: JSON.stringify({
          name: value,
        }),
        headers: {
          "Content-type": "application/json", // The type of data you're sending
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          document
            .querySelector(".videocallApp")
            .classList.remove("videocallApp");
          document.querySelector(".initialForm").classList.add("videocallApp");

          let apiKey = data.session.ot.apiKey.toString();
          let sessionId = data.session.sessionId;
          let token = data.tokenAdmin;

          // generateVideoCall(sessionId, token);

          setTimeout(() => {
            initializeSession(apiKey, sessionId, token);
          }, 100);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });

  function handleError(error) {
    if (error) {
      alert(error.message);
    }
  }

  function initializeSession(apiKey, sessionId, token) {
    if (OT.checkSystemRequirements() == 1) {
      var session = OT.initSession(apiKey, sessionId);
    } else {
      // The client does not support WebRTC.
      // You can display your own message.
    }
    // var session = OT.initSession(apiKey, sessionId);

    // Subscribe to a newly created stream
    session.on("streamCreated", function (event) {
      session.subscribe(
        event.stream,
        "subscriber",
        {
          insertMode: "append",
          width: "100%",
          height: "100%",
        },
        handleError
      );
    });

    // Create a publisher
    var publisher = OT.initPublisher(
      "publisher",
      {
        insertMode: "append",
        width: "100%",
        height: "100%",
      },
      handleError
    );

    // Connect to the session
    session.connect(token, function (error) {
      // If the connection is successful, publish to the session
      if (error) {
        handleError(error);
      } else {
        session.publish(publisher, handleError);
      }
    });
  }
});
