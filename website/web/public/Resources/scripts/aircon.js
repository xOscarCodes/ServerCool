function AirCon(ui) {
    this.ui = ui;
}

AirCon.prototype.getStatus = function () {
    // $.getJSON("aircon.php", function (data) {
    //     var currentStatus = data.aircons.ac1;
    //     ui.setStatus(currentStatus);
    // }.bind(this))
    
    // $.getJSON("aircon.php?weather", function (data) {
    //     //console.log(data);
    //     ui.setroomTemp(Math.round(25));
    // }.bind(this))
    }

AirCon.prototype.set = function (json) {
    //console.log(json)
    // $.getJSON('aircon.php?json=' + json, function (data) {
    //     console.log("Sent: " + json);
    // }.bind(this))
}
