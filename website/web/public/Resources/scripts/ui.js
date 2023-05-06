const urlParams = new URLSearchParams(window.location.search);
const nodeValue = urlParams.get('node');
const node = "Node " + nodeValue;
const times = ["3", "6", "9", "12", "24"];
document.title = node + " AC Controller";
let mqttURI = 'http://localhost:5001/send-command';
const API_URL = `http://localhost:5000/api/nodes/${nodeValue}`;


// fetch data from MongoDB
const fetchData = async () => {
    const data = await $.get(`${API_URL}`);
    
    return data[0];
}
var acTemp = 21;
setTimeout(function () {
    fetchData().then((data) => {
        console.log(data);
        acTemp = data.actemp;
        document.getElementById("currenttemperature").textContent = data.actemp + "°";
        document.getElementById("pageTitle").textContent = data.location;
       
        $(".roomtemperature").text(data.roomtemp.toFixed(0) + "°C");



        function AirConUI() {
            this.temp = acTemp;
            this.modes = { "COOL": 0 }
            this.fanmodes = { "Auto": 0, "Low": 1, "Medium": 2, "High": 3 }
            this.fanspeeds = ["Auto", "Low", "Medium", "High"];
            this.colors = [
                //Cool
                {
                    "main": "#46A5EE", "alternative": "#83C3F4"
                },
                // // //Heat
                // {
                //     "main": "#EE8F46", "alternative": "#F4B483"
                // },
                //Fan
                {
                    "main": "#767F87", "alternative": "#4C5156", "background": "#A1A7AD"
                }
            ];

            this.mode = -1;
            this.fanmode = this.fanmodes.Low
            // this.zoneState = [0, 20, 100, 0, 0, 10];
            this.on = true;

            // $("#zones").hide();
            $("#offroomtemperature").hide();
            $("#offmessage").hide();
            $("#powerbutton").click(this.togglepower.bind(this));
            $(".modeselection").click(this.togglemode.bind(this));
            $("#increasetemp, #decreasetemp").click(this.toggletemp.bind(this));

            // $("#controllink").click(function () {
            //     $("#zones").hide();
            //     $("#control").show();
            // })

            // $("#zonelink").click(function () {
            //     $("#control").hide();
            //     $("#zones").show();
            // })

            // $(".pip").draggable({axis: "x", containment: "#controlfan", scroll: false, revert: true});
            // $(".pip").droppable({drop: this.togglefan.bind(this)});
            $(".fanspeedselection").click(this.togglefan.bind(this));

            $("#submit-btn").click(this.submit.bind(this));

            // document.getElementById("submit-btn").addEventListener("click", () => {
            //     console.log(this.temp, this.fanmode)
            // })


            this.isConnected = true;
            this.aircon = new AirCon();
            // this.connect();

        }

        // AirConUI.prototype.connect = function () {
        //     $('#modaltext').html(' <i class="fas fa-sync-alt fa-spin"></i><br>Connecting');
        //     this.aircon.getStatus();
        //     counter = 0;
        //     interval = setInterval(function () {
        //         counter++;
        //         if (counter == 7) {
        //             $("#connectingpopup").fadeIn();
        //         }
        //     }, 1000);
        // }

        // AirConUI.prototype.connected = function () {
        //     $('#modaltext').html('<i class="fas fa-check" style="color:green"></i><br>Connected');
        //     clearInterval(interval);
        //     setTimeout(function () {
        //         $('#modal').fadeOut();
        //     }, 500);
        //     // setInterval(this.aircon.getStatus, 60000);
        // }

        AirConUI.prototype.submit = function () {
            var timer = document.getElementById("timer-range");
            const time = timer.value;
            console.log(this.temp, this.fanspeeds[this.fanmode], times[time]);
            nodeId = nodeValue;
            temperature = this.temp;
            fanSpeed = this.fanspeeds[this.fanmode];
            delayTime = times[time];
            Status = this.on;
            const body = {
                nodeId,
                temperature,
                fanSpeed,
                delayTime,
                Status
            }
            $.post(mqttURI, body);
            alert("Command Sent!");
            //retrieveing the current logged-in user
            fetch('/users/me')
                .then(res => {
                    if (res.status === 401) {
                        throw new Error('Not authenticated');
                    }

                    return res.json();
                })
                .then(user => {
                    // Use user data
                    let message = `Sets Node: ${nodeId} AC temp ${temperature} and fan speed to ${fanSpeed} for ${delayTime} hours.`
                    console.log(user[0].name);
                    userName = user[0].name;
                    userId = user[0]._id;
                    let body2 = {
                        userName, userId, message
                    }
                    $.post("http://localhost:5000/api/audit", body2);

                })
                .catch(error => {
                    // Handle error
                });
        }

        AirConUI.prototype.setStatus = function (status) {
            console.log(status);
            this.temp = new Number(status.info.setTemp);
            this.on = status.info.state == "on";
            this.previousMode = this.mode;
            if (status.info.mode == "cool")
                this.mode = this.modes.COOL;
            if (status.info.mode == "heat")
                this.mode = this.modes.HEAT;
            if (status.info.mode == "vent")
                this.mode = this.modes.FAN;

            if (status.info.fan == "low")
                this.fanmode = this.fanmodes.Low;
            if (status.info.fan == "medium")
                this.fanmode = this.fanmodes.Medium;
            if (status.info.fan == "high")
                this.fanmode = this.fanmodes.High;
            if (status.info.fan == "auto")
                this.fanmode = this.fanmodes.Auto;

            // this.zones = {};
            // this.zoneState = [];
            // var zoneCount = 1;
            // for (zone in status.zones) {
            //     this.zones[status.zones[zone].name] = zoneCount;
            //     if (status.zones[zone].state == "close")
            //         this.zoneState.push(0);
            //     else
            //         this.zoneState.push(status.zones[zone].value)
            //     zoneCount++;
            // }

            this.update();
            if (!this.isConnected) {
                this.isConnected = true;
                this.connected();
            }
        }

        AirConUI.prototype.setroomTemp = function (temp) {
            $(".roomtemperature").text(temp + "°C");

        }

        // AirConUI.prototype.fakeConnect = function () {
        //     $('#modaltext').html('<i class="fas fa-sync fa-spin"></i>&nbsp;&nbsp;Connecting');
        //     setTimeout(function () {
        //         $('#modaltext').html('<i class="fas fa-check" style="color:green"></i>&nbsp;&nbsp;Connected');
        //         setTimeout(function () {
        //             $('#modal').fadeOut();
        //         }, 500);
        //     }, 500);
        // }

        // AirConUI.prototype.error = function (error) {
        //     $('#modaltext').html('<i class="fas fa-exclamation-triangle" style="color:red"></i></i>&nbsp;&nbsp;' + error);
        //     $('#modal').fadeIn();
        // }

        AirConUI.prototype.update = function () {
            // this.setzones();
            this.setfan();
            this.setmode();
            this.setpower();
            this.settemp();
        }

        // AirConUI.prototype.setzones = function () {
        //     zoneHTML = "";
        //     for (zone in this.zones) {
        //         state = this.zoneState[this.zones[zone] - 1];
        //         zoneHTML += '<div class="zonebox" id="zonebox' + (this.zones[zone] - 1) + '">'
        //         zoneHTML += '<div class="zonetitle">' + zone + '</div>'
        //         if (state == 0)
        //             zoneHTML += '<div class="zonedisabled zonestatus">OFF</div>'
        //         else
        //             zoneHTML += '<div class="zonestatus"><div class="zonecontrol zonedecrease" id="zonedecrease' + (this.zones[zone] - 1) + '"><i class="fas fa-minus"></i></div><div class="zonestate">' + state
        //                 + '%</div><div class="zonecontrol zoneincrease" id="zoneincrease' + (this.zones[zone] - 1) + '"><i class="fas fa-plus"></i></div></div>';
        //         zoneHTML += '</div>'
        //     }
        //     zoneHTML += '<div class="lastzone"></div>'
        //     $("#zonecontent").html(zoneHTML);

        //     $('.zoneincrease, .zonedecrease').removeClass("coolmain heatmain fanmain");

        //     if (this.mode === 0) {
        //         $('.zoneincrease, .zonedecrease').addClass("coolmain");
        //     } else if (this.mode === 1) {
        //         $('.zoneincrease, .zonedecrease').addClass("heatmain");
        //     } else if (this.mode === 2) {
        //         $('.zoneincrease, .zonedecrease').addClass("fanmain");
        //     }

        //     $(".zonecontrol").click(this.incrementzone.bind(this));
        //     $(".zonebox").click(this.togglezone.bind(this));
        // }

        AirConUI.prototype.incrementzone = function (event) {
            id = event.currentTarget.id.substr(-1);

            if (event.currentTarget.id.includes('increase'))
                this.zoneState[id] += 10;
            else
                this.zoneState[id] -= 10;


            if (this.zoneState[id] < 0) this.zoneState[id] = 0;
            if (this.zoneState[id] > 100) this.zoneState[id] = 100;
            var zid = new Number(id) + 1;
            if (this.zoneState[id] > 0)
                var json = '{"ac1":{"info":{"order":0},"zones":{"z0' + zid + '":{"state":"open","value":' + this.zoneState[id] + '}}}}';
            else
                var json = '{"ac1":{"info":{"order":0},"zones":{"z0' + zid + '":{"state":"close","value":' + this.zoneState[id] + '}}}}';
            this.aircon.set(json);
            this.setzones();
        }

        // AirConUI.prototype.togglezone = function (event) {
        //     id = event.currentTarget.id.substr(-1);
        //     if (this.zoneState[id] == 0)
        //         this.zoneState[id] = 100;
        //     else
        //         this.zoneState[id] = 0;

        //     var zid = new Number(id) + 1;
        //     if (this.zoneState[id] > 0)
        //         var json = '{"ac1":{"info":{"order":0},"zones":{"z0' + zid + '":{"state":"open","value":' + this.zoneState[id] + '}}}}';
        //     else
        //         var json = '{"ac1":{"info":{"order":0},"zones":{"z0' + zid + '":{"state":"close","value":' + this.zoneState[id] + '}}}}';
        //     this.aircon.set(json);
        //     this.setzones();
        // }

        AirConUI.prototype.setfan = function () {
            $(".autocircle").removeClass("selectedautocircle");
            $(".fanspeedicon").removeClass("selectedfanspeed");
            $("#autofan").removeClass("selectedautofan");
            $(".arrowbox i").removeClass("selectedcolour");
            $(".fanspeedtitle").removeClass("selectedcolour");
            $("#fan0").removeClass("coolmainbg heatmainbg fanmainbg");
            $("#fan1").removeClass("coolmainbg heatmainbg fanmainbg");
            $("#fan2").removeClass("coolmainbg heatmainbg fanmainbg");
            $("#fan3").removeClass("coolmainbg heatmainbg fanmainbg");
            if (this.mode === 0) {
                $("#fan" + this.fanmode).addClass("coolmainbg");
            } else if (this.mode === 1) {
                $("#fan" + this.fanmode).addClass("heatmainbg");
            } else if (this.mode === 2) {
                $("#fan" + this.fanmode).addClass("fanmainbg");
            }
            $("#fan" + this.fanmode + " .arrowbox i").addClass("selectedcolour");
            $("#fan" + this.fanmode + " .fanspeedtitle").addClass("selectedcolour");


            if (this.fanmode != 0) {
                $("#icon" + this.fanmode).addClass("selectedfanspeed");
            } else {
                $("#icon" + this.fanmode).addClass("selectedautocircle");
                $("#autofan").addClass("selectedautofan");
            }
            if (this.fanspeeds[this.fanmode] == "Auto") {
                $("#currentfanspeedicon").attr('src', 'img/autospeed.svg');
                $('#currentfanspeed').text("Auto");
            }
            else if (this.fanspeeds[this.fanmode] == "Low") {
                $("#currentfanspeedicon").attr('src', '/Resources/images/lowspeed.svg');
                $('#currentfanspeed').text("Low");
            }
            else if (this.fanspeeds[this.fanmode] == "Medium") {
                $("#currentfanspeedicon").attr('src', '/Resources/images/mediumspeed.svg');
                $('#currentfanspeed').text("Medium");
            }
            else if (this.fanspeeds[this.fanmode] == "High") {
                $("#currentfanspeedicon").attr('src', '/Resources/images/highspeed.svg');
                $('#currentfanspeed').text("High");
            }
        }

        AirConUI.prototype.togglefan = function (event) {
            if (event.type == "click")
                this.fanmode = event.currentTarget.id.substr(-1);
            else
                this.fanmode = event.target.id.substr(-1);
            this.setfan();
            if (this.fanmode == this.fanmodes.Auto)
                var fan = "auto";
            else if (this.fanmode == this.fanmodes.Low)
                var fan = "low";
            else if (this.fanmode == this.fanmodes.Medium)
                var fan = "medium";
            else if (this.fanmode == this.fanmodes.High)
                var fan = "high";
            var json = '{"ac1":{"info":{"order":0,"fan":"' + fan + '"},"zones":{}}}';
            this.aircon.set(json);

            var $elem = $("#icon" + this.fanmode);
            var uifanspeeds = [1500, 2000, 1500, 1100];
            var speed = uifanspeeds[this.fanmode];

            if (this.fanmode == 0) {
                degValue = 360;
            } else {
                degValue = 720;
            }

            $({ deg: 0 }).animate({ deg: degValue }, {
                duration: speed,
                step: function (now) {
                    $elem.css({
                        transform: 'rotate(' + now + 'deg)'
                    });
                }
            });
        }

        AirConUI.prototype.settemp = function () {
            if (this.on) {
                if ((this.temp + "°") != $("#currenttemperature").text()) {
                    $("#currenttemperature").fadeOut(200, function () {
                        $("#currenttemperature").text(this.temp + "°");
                        $("#currenttemperature").fadeIn(200);
                    }.bind(this));
                }
            }
            else
                $("#currenttemperature").text(this.temp + "°");
        }

        AirConUI.prototype.toggletemp = function (event) {
            if (event.currentTarget.id.includes('increase'))
                this.temp++;
            else
                this.temp--;

            if (this.temp >= 25) {
                this.temp = 25;
                $("#increasetemp").addClass("tempdisabled");
            }
            if (this.temp > 17 && this.temp < 25) {
                $("#decreasetemp").removeClass("tempdisabled");
                $("#increasetemp").removeClass("tempdisabled");
            }
            if (this.temp <= 17) {
                this.temp = 17;
                $("#decreasetemp").addClass("tempdisabled");
            }

            var json = '{"ac1":{"info":{"order":0,"setTemp":' + this.temp + '},"zones":{}}}';
            this.aircon.set(json);
            this.settemp();
        }

        AirConUI.prototype.setmode = function () {
            if (this.mode != this.previousMode) {
                $("#sidebar").removeClass();
                $("#coolselection").removeClass("coolmainbg");
                $("#heatselection").removeClass("heatmainbg");
                $("#fanselection").removeClass("fanmainbg");
                $("#coolbox, #heatbox, #fanbox").removeClass("selectedcolour");
                $("#decreasetemp, #increasetemp").removeClass("cooldark heatdark fandark");
                $("#currentmodebox").removeClass();
                $("#coolboximg").removeClass();
                $("#heatboximg").removeClass();
                $("#fanboximg").removeClass();

                if (this.mode == this.modes.COOL) {
                    $("#coolselection").addClass("coolmainbg");
                    $("#coolbox").addClass("selectedcolour");
                    $("#coolboximg").addClass("selectedcoolimg");
                    $("#decreasetemp, #increasetemp").addClass("cooldark");
                    $("#currentmodebox").addClass("currentcoolmode");
                }
                else if (this.mode == this.modes.HEAT) {
                    $("#heatselection").addClass("heatmainbg");
                    $("#heatbox").addClass("selectedcolour");
                    $("#heatboximg").addClass("selectedheatimg");
                    $("#decreasetemp, #increasetemp").addClass("heatdark");
                    $("#currentmodebox").addClass("currentheatmode");
                }
                else if (this.mode == this.modes.FAN) {
                    $("#fanselection").addClass("fanmainbg");
                    $("#fanbox").addClass("selectedcolour");
                    $("#fanboximg").addClass("selectedfanimg");
                    $("#decreasetemp, #increasetemp").addClass("fandark");
                    $("#currentmodebox").addClass("currentfanmode");
                }

                if (this.mode == 0) {
                    $("#sidebar").addClass("coolmainbg");
                    $(".zoneincrease, .zonedecrease").addClass("coolmain");
                } else if (this.mode == 1) {
                    $("#sidebar").addClass("heatmainbg");
                    $(".zoneincrease, .zonedecrease").addClass("heatmain");
                } else if (this.mode == 2) {
                    $("#sidebar").addClass("fanmainbg");
                    $(".zoneincrease, .zonedecrease").addClass("fanmain");
                }

            }
        }

        AirConUI.prototype.togglemode = function (event) {
            this.previousMode = this.mode;
            if (event.currentTarget.id.includes('cool')) {
                this.mode = this.modes.COOL;
                var modename = "cool";
            }
            else if (event.currentTarget.id.includes('fan')) {
                this.mode = this.modes.FAN;
                var modename = "vent";
            }

            if (this.previousMode != this.mode) {
                this.update();
                var json = '{"ac1":{"info":{"order":0,"mode":"' + modename + '"},"zones":{}}}';
                this.aircon.set(json);
            }
        }

        AirConUI.prototype.setpower = function () {
            if (!this.on) {
                $("#otherinformation").fadeOut(function () {
                    $("#offroomtemperature").fadeIn();
                });
                $("#currenttemperature").fadeOut(function () {
                    $("#offmessage").fadeIn();
                });
                $("#decreasetemp").fadeOut();
                $("#increasetemp").fadeOut();
                $("#powerbutton").removeClass();
                $("#powerbutton").addClass("poweroff");
                if (this.mode === 0) {
                    $("#powerbutton i").addClass("coolalt");
                } else if (this.mode === 1) {
                    $("#powerbutton i").addClass("heatalt");
                } else if (this.mode === 2) {
                    $("#powerbutton i").addClass("fanalt");
                }
            }
            else {
                $("#offroomtemperature").fadeOut(function () {
                    $("#otherinformation").fadeIn();
                });
                $("#offmessage").fadeOut(function () {
                    $("#currenttemperature").fadeIn();
                    $("#decreasetemp").fadeIn();
                    $("#increasetemp").fadeIn();
                });
                $("#powerbutton").removeClass();
                $("#powerbutton i").removeClass("coolalt heatalt fanalt");
                $("#powerbutton").removeClass("poweroff");
                if (this.mode === 0) {
                    $("#powerbutton").addClass("coolaltbg");
                } else if (this.mode === 1) {
                    $("#powerbutton").addClass("heataltbg");
                } else if (this.mode === 2) {
                    $("#powerbutton").addClass("fanaltbg");
                }

                if (!this.isConnected) {
                    $('#currenttemperature').each(function () {
                        var $this = $(this);
                        $({ countNum: $this.text() }).animate({
                            countNum: ui.temp
                        },
                            {
                                duration: 900,
                                easing: 'easeInQuad',
                                step: function () {
                                    $this.text(Math.floor(this.countNum) + "°");
                                },
                                complete: function () {
                                    $this.text(this.countNum + "°");
                                }
                            });
                    });
                }
            }
        }

        AirConUI.prototype.togglepower = function () {
            this.on = !this.on;
            if (this.on)
                var json = '{"ac1":{"info":{"order":0,"state":"on"},"zones":{}}}';
            else
                var json = '{"ac1":{"info":{"order":0,"state":"off"},"zones":{}}}';
            this.aircon.set(json);
            this.setpower();
        }

        $(document).ready(function () {

            ui = new AirConUI();
        });
    });
}, 1000);