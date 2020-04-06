/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojarraydataprovider','configs',  'ojs/ojcollectiondataprovider','ojs/ojmodel','ojs/ojpagingdataproviderview', 'ojs/ojmodel','ojs/ojnavigationlist','ojs/ojswitcher',
    'ojs/ojdatagrid',  'ojs/ojknockout', 'ojs/ojlistview','ojs/ojarraytabledatasource', 'ojs/ojcheckboxset', 'ojs/ojselectcombobox','ojs/ojnavigationlist', 'ojs/ojoffcanvas'],
 function(oj, ko, $, ArrayDataProvider,configs,CollectionDataProvider,Model,PagingDataProviderView ) {

    function MyTasksListViewModel() {
      var self = this;
      self.mytaskUserTableArray = ko.observableArray();
      self.serviceURL = configs.url;
         console.log(self.serviceURL + 'myTasks/mytaskstaging')
       $.ajax({
                    url:self.serviceURL + 'myTasks/mytaskstaging',
                    type: 'GET',
                    dataType: 'json',
                    success: function (data2) {
                        //console.log(data2.items);
                        var fields = data2.items;
                        for (var i = 0; i < fields.length; i++) {
                            self.mytaskUserTableArray.push({Company :fields[i].company_code,documentType:fields[i].document_type,vendorid:fields[i].vendor_id,vendorname:fields[i].vendor_name,invoicenum:fields[i].invoice_num,invoiceamt:fields[i].invoice_amount,
                            ponumber:fields[i].po_number,acquiredbyname:fields[i].acquired_by_name,scanbatchname:fields[i].scan_batch_name,scanDate:fields[i].scan_date,tasknumber:fields[i].task_number,status:fields[i].status,url:fields[i].document_uri});
                        }

                    },
                   
                    error: function (data, e) {
                        //window.location.href = configs.weblogicServerUrl+"dashboard/logout";
                        //console.log("Error");
                    }
                });
                console.log(self.mytaskUserTableArray())
//     self.mytaskUserTableArray.push({Company :'North',documentType:'NA' ,vendorid:'123',vendorname:'Ecovues',invoicenum:'1234',invoiceamt:'1000.23',
//                            ponumber:'400',acquiredbyname:'NA',scanbatchname:'123',scanDate:'31/03/2020',tasknumber:'32',status:'Pending',url:"http://129.144.61.135:16004/imaging/faces/Pages/UrlTools.jspx?ToolName=AWVWR&DocumentId=4.IPM_007660"})
    self.selectedItem = ko.observable("home");
    
      
			self.outerDrawer = {
				"displayMode": "push",
				"selector": "#oDrawer",
				"content": "#oMain",
				"autoDismiss": "none"
			};
			self.toggleOuter = function() {
				return oj.OffcanvasUtils.toggle(self.outerDrawer);
			}
			self.closeInner = function() {
				return oj.OffcanvasUtils.close(self.outerDrawer);
			};
      
      var myTasksSummaryURL = 'http://129.144.61.135:16004/dashboard/resources/dashboard/asoftoday?orgid=0&regioncode=NA';
      self.myTasksSummaryArray = ko.observableArray();
      console.log(myTasksSummaryURL)
      $.ajax({
          url: myTasksSummaryURL,
          type: 'GET',
          dataType: 'json',
          success: function(data) {
             var fields = data.items;
             var taskarray = [];
             var statusvalue;
             for ( var i = 0; i < fields.length; i++ ) {
                 statusvalue = fields[i].status.match(/\b(\w)/g) ;
                 statusvalue = statusvalue.join('');
                 taskarray.push({
                     label: fields[i].status+"( "+fields[i].count+" )",
                     value: statusvalue,
                     status: fields[i].status,
                     count: fields[i].count
                 });
             }
             self.myTasksSummaryArray(taskarray);
             console.log(self.myTasksSummaryArray());
      console.log("Opening Drawer")
      return oj.OffcanvasUtils.open(self.outerDrawer);
          }
          
      });
      
      var status = 'Pending Verification'
      var matches = status.match(/\b(\w)/g); // ['J','S','O','N']
      var acronym = matches.join('');
      console.log('Acronym:' + acronym)
      this.mytasksSummaryProvider = new ArrayDataProvider(self.myTasksSummaryArray);
      self.statusDP = ko.observable(new ArrayDataProvider(self.myTasksSummaryArray));
      self.myTaskpagingDataSource =ko.observable()
      console.log(self.statusDP());
      // var mytasksURL = 'http://129.144.61.135:16004/dashboard/resources/search/apinvoicesLIST?orgid=204&invoicestatus=PENDING%20VERIFICATION';
      var mytasksURL = self.serviceURL + 'myTasks/mytaskstaging';
//      var model = oj.Model.extend({
//        idAttribute: 'scan_document_id'
//      });
//  
//      this.collection = new oj.Collection(null, {
//        url: mytasksURL,
//        model: model
//      });
//      
//      var originalCollection = this.collection;
//      console.log(originalCollection)
//      // this.dataProvider = ko.observable();
//      // this.dataProvider(new PagingDataProviderView(new CollectionDataProvider(this.collection)));
//      this.dataSource = ko.observable(new oj.PagingTableDataSource(new oj.CollectionTableDataSource(this.collection)));
//  var model = Model.Model.extend({
//              idAttribute: 'scan_document_id'
//          });
//  
//          var collection = new Model.Collection(null, {
//              url: mytasksURL,
//              model: model
//          });
//  console.log(collection)
//          this.collection = collection;
//          this.dataSource(new PagingDataProviderView(new CollectionDataProvider(this.collection)));
//var data =self.mytaskUserTableArray();
 self.myTaskpagingDataSource= new PagingDataProviderView(new ArrayDataProvider(self.mytaskUserTableArray)); 
 console.log(self.myTaskpagingDataSource)
      this.currentAging = [];
      this.currentStatus = [];
      this.scurrentAging = [];
      this.currentinvtype = [];
      this.currentSort = ko.observable('1h');
       // this.currentStatus = ko.observable('pv');
      
      var criteriaMap = {};
      criteriaMap.lh = { key: 'creation_date', direction: 'ascending' };
      criteriaMap.hl = { key: 'creation_date', direction: 'descending' };
      criteriaMap.invoicenum = { key: 'invoice_num', direction: 'ascending' };
      criteriaMap.aging = { key: 'aging_by_scan_date', direction: 'ascending' };
  
       this.executeSort = function (key, direction) {
//        if (key) {
//          this.collection.comparator = key;
//          if (direction === 'ascending') {
//            this.collection.sortDirection = 1;
//          } else {
//            this.collection.sortDirection = -1;
//          }
//        }
//        this.collection.sort();
      }.bind(this);
  
      this.handleSortCriteriaChanged = function (event, ui) {
        var criteria = criteriaMap[event.detail.value];
        if (criteria) {
          this.executeSort(criteria.key, criteria.direction);
        } else {
          this.handleFilterChanged(event, ui);
        }
      }.bind(this);
      
      this.invoicestatus = [
        {value: 'PV', label: 'Pending Verification'},
        {value: 'AD', label: 'Account Distribution'},
        {value: 'SM', label: 'Supplier Maintenance'},
        {value: 'AE', label: 'AP Exceptions'},
        {value: 'RTI', label: 'Ready to Import'},
        {value: 'IR', label: 'Import Rejections'}
      ];
      this.invoicestatusDP = ko.observable(new ArrayDataProvider(this.invoicestatus, {keyAttributes: 'value'}));
      
      this.invoicecat = [
        {value: 'po', label: 'PO'},
        {value: 'nopo', label: 'NO-PO'}
      ];
      this.invoicecatDP = ko.observable(new ArrayDataProvider(this.invoicecat));
      
      var filters = ['lt10', '11to20', '21to30', '31to40','41to50','51to60','gt60', 'slt10', 's11to20', 's21to30', 's31to40','s41to50','s51to60','sgt60','PV', 'AE', 'AD', 'RTI', 'SM','R','po','nopo'];
  
      var filterFunc = {};
      filterFunc.lt10 = function (model) { return (parseFloat(model.get('aging_by_invoice_date')) <= 10); };
      filterFunc['11to20'] = function (model) { return (parseFloat(model.get('aging_by_invoice_date')) >= 11 && parseFloat(model.get('aging_by_invoice_date')) <= 20); };
      filterFunc['21to30'] = function (model) { return (parseFloat(model.get('aging_by_invoice_date')) >= 21 && parseFloat(model.get('aging_by_invoice_date')) <= 30); };
      filterFunc['31to40'] = function (model) { return (parseFloat(model.get('aging_by_invoice_date')) >= 31 && parseFloat(model.get('aging_by_invoice_date')) <= 40); };
      filterFunc['41to50'] = function (model) { return (parseFloat(model.get('aging_by_invoice_date')) >= 41 && parseFloat(model.get('aging_by_invoice_date')) <= 50); };
      filterFunc['51to60'] = function (model) { return (parseFloat(model.get('aging_by_invoice_date')) >= 51 && parseFloat(model.get('aging_by_invoice_date')) <= 60); };
      filterFunc.gt60 = function (model) { return (parseFloat(model.get('aging_by_invoice_date')) > 60); };
  
      filterFunc.slt10 = function (model) { return (parseFloat(model.get('aging_by_scan_date')) <= 10); };
      filterFunc['s11to20'] = function (model) { return (parseFloat(model.get('aging_by_scan_date')) >= 11 && parseFloat(model.get('aging_by_scan_date')) <= 20); };
      filterFunc['s21to30'] = function (model) { return (parseFloat(model.get('aging_by_scan_date')) >= 21 && parseFloat(model.get('aging_by_scan_date')) <= 30); };
      filterFunc['s31to40'] = function (model) { return (parseFloat(model.get('aging_by_scan_date')) >= 31 && parseFloat(model.get('aging_by_scan_date')) <= 40); };
      filterFunc['s41to50'] = function (model) { return (parseFloat(model.get('aging_by_scan_date')) >= 41 && parseFloat(model.get('aging_by_scan_date')) <= 50); };
      filterFunc['s51to60'] = function (model) { return (parseFloat(model.get('aging_by_scan_date')) >= 51 && parseFloat(model.get('aging_by_scan_date')) <= 60); };
      filterFunc.sgt60 = function (model) { return (parseFloat(model.get('aging_by_scan_date')) > 60); };
  
      filterFunc.PV = function (model) { return (model.get('imaging_status').indexOf('PENDING VERIFICATION') > -1); };
      filterFunc.AE = function (model) { return (model.get('imaging_status').indexOf('AP EXCEPTIONS') > -1); };
      filterFunc.AD = function (model) { return (model.get('imaging_status').indexOf('ACCOUNT DISTRIBUTION') > -1); };
      filterFunc.RTI = function (model) { return (model.get('imaging_status').indexOf('READY TO IMPORT') > -1); };
      filterFunc.SM = function (model) { return (model.get('imaging_status').indexOf('SUPPLIER MAINTENANCE') > -1); };
      filterFunc.R = function (model) { return (model.get('imaging_status').indexOf('REJECTED') > -1); };
      
      filterFunc.po = function (model) { return (model.get('invoice_type').indexOf('PO') > -1); };
      filterFunc.nopo = function (model) { return (model.get('invoice_type').indexOf('NO-PO') > -1); };
     
       // eslint-disable-next-line no-unused-vars
      this.handleFilterChanged = function (event, ui) {
        var value = event.detail.value;
        if (!Array.isArray(value)) {
          return;
        }
  
        var results = [];
        var processed = false;
  
        $.each(filters, function(index, filter)
            {
                if (value.indexOf(filter) > -1)
                {  
                    results = results.concat(originalCollection.filter(filterFunc[filter]));
                    processed = true;
                }
            });
  
        if (processed) {
                self.collection = new oj.Collection(results);
        } else {
          this.collection = originalCollection;
        }
            self.dataSource(new oj.PagingTableDataSource(new oj.CollectionTableDataSource(self.collection)));

            if (self.currentSort() != "default")
            {
                var criteria = criteriaMap[self.currentSort()];
                self.dataSource().sort(criteria);
            }
      }.bind(this);
  
      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
       
      self.connected = function() {
        //accUtils.announce('Dashboard page loaded.', 'assertive');
        // document.title = "Dashboard New";
        // Implement further logic if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function() {
        // Implement if needed
      };
    }
    
    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return new MyTasksListViewModel();
  }
);
