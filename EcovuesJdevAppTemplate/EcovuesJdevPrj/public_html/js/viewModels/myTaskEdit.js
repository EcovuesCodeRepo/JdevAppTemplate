/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * myTaskEdit module
 */
define(['ojs/ojcore', 'knockout','ojs/ojselectcombobox', 'ojs/ojformlayout','ojs/ojinputnumber','ojs/ojinputtext','ojs/ojlabel','ojs/ojcheckboxset','ojs/ojdatetimepicker','ojs/ojbutton'], function (oj, ko) {

    /**
     * The view model for the main content view template
     */
    function myTaskEditContentViewModel() {
        var self = this;
        self.legalEntityVal = ko.observable();
        self.legalEntityoptions = ko.observableArray()
        self.Supidval = ko.observable("10");
        self.taskNumberval = ko.observable();
        self.poOptions = ko.observableArray();
        self.poValue = ko.observable();
        self.dateValue= ko.observable();
        self.openf = function(){
            
        }
        self.savef = function(){
            
        }
        self.rejectf = function(){
            
        }
        self.cancelf = function(){
             window.history.go(-1);
        }
        self.nextf = function(){
            
        }
        self.submitf = function(){
            
        }

    }
    
    return myTaskEditContentViewModel;
});
