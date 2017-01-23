$(function() {
    function ReglagesViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.settings = parameters[1];

        // TODO remove with release of 1.3.0 and switch to OctoPrint.coreui usage
        self.control = parameters[2];

		self.eepromMZOffsetRegEx = /Offset Z : (.*)/;
        self.eepromM851RegEx = /M851 ([Z])(.*)/;
        self.isErrorOrClosed = ko.observable(undefined);
        self.isOperational = ko.observable(undefined);
        self.isPrinting = ko.observable(undefined);
        self.isPaused = ko.observable(undefined);
        self.isError = ko.observable(undefined);
        self.isReady = ko.observable(undefined);
        self.isLoading = ko.observable(undefined);

		self.targetPID=ko.observable(210);
		self.tempmax=ko.observable(330);
		self.toolSelect=ko.observable(0);

		self.Offset=ko.observable(0);


		self.modTool = function (ind) {
          self.toolSelect(Number(ind));
        }
        
        self.toolSelectName= function()  {
          n=self.toolSelect();
          if (n<0) {
            return('Bed');
          } else {
            return('Tool '+n);
          }
          
        }

		self.setTargetPIDPlus = function () {
          self.modTargetPID(1);
        }
        
 		self.setTargetPIDMoins = function () {
          self.modTargetPID(-1);
        }
        
        self.modTargetPID =function (val) {
        	self.targetPID(Number(self.targetPID())+val);  
        }
 
        self.autotunePID =function () {
        	 self.sendCustomCommand({
                		command: "M303 E"+self.toolSelect()+" S"+self.targetPID()+ " C8"
                
            			}); 
        }


        
        self.setOffsetPlus = function () {
          self.modOffset(0.05);
        }
        
 		self.setOffsetMoins = function () {
          self.modOffset(-0.05);
        }
        
        self.modOffset =function (val) {
           var newval= Math.round((Number(self.Offset())+val)*100)/100
        	self.Offset(newval);  
        }
		
        self.sendOffset =function () {
                  	 self.sendCustomCommand({
                		commands: ["M851 Z"+self.Offset(), "M500"]
                
            			}); 
          
        }
        
        self.majM851 =function () {
                  	 self.sendCustomCommand({
                		command: "M851"
                
            			}); 
          
        }
         self.homexyz =function () {
                  	 $.ajax({
                    url: API_BASEURL + "printer/home",
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=UTF-8",
                    data: JSON.stringify({"command": "home", "axes" :["x","y","z"] })
                }) 
          
        }
          self.fromCurrentData = function (data) {
            self._processStateData(data.state);
                    _.each(data.logs, function (line) {
                    var match = self.eepromM851RegEx.exec(line);
                    if (match) {
                      	
                        self.Offset(Number(match[2]));
                    	}
                      
                    match = self.eepromMZOffsetRegEx.exec(line);
                    if (match) {
                      	
                        self.Offset(Number(match[1]));
                    	}
                    });
            
            
            
        };
	
        self.fromHistoryData = function (data) {
            self._processStateData(data.state);
        };

        self._processStateData = function (data) {
            self.isErrorOrClosed(data.flags.closedOrError);
            self.isOperational(data.flags.operational);
            self.isPaused(data.flags.paused);
            self.isPrinting(data.flags.printing);
            self.isError(data.flags.error);
            self.isReady(data.flags.ready);
            self.isLoading(data.flags.loading);
        };







        

      

       

        self.sendCustomCommand = function (command) {
            if (!command)
                return;

            var data = undefined;
            if (command.hasOwnProperty("command")) {
                // single command
                data = {"command": command.command};
            } else if (command.hasOwnProperty("commands")) {
                // multi command
                data = {"commands": command.commands};
            } else if (command.hasOwnProperty("script")) {
                data = {"script": command.script};
                if (command.hasOwnProperty("context")) {
                    data["context"] = command.context;
                }
            } else {
                return;
            }

            if (command.hasOwnProperty("input")) {
                // parametric command(s)
                data["parameters"] = {};
                _.each(command.input, function(input) {
                    if (!input.hasOwnProperty("parameter") || !input.hasOwnProperty("value")) {
                        return;
                    }

                    data["parameters"][input.parameter] = input.value();
                });
            }

            $.ajax({
                url: API_BASEURL + "printer/command",
                type: "POST",
                dataType: "json",
                contentType: "application/json; charset=UTF-8",
                data: JSON.stringify(data)
            })
        };

     

	self.onAfterBinding = function () {
     self.toolSelect(0); 
     self.majM851();
      
    }


   

    }

    OCTOPRINT_VIEWMODELS.push([
        ReglagesViewModel,
        ["loginStateViewModel", "settingsViewModel", "controlViewModel"],
        "#reglages"
    ]);
});
