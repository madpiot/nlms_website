'use strict';

angular.module('nlmsApp', []);

angular.module('nlmsApp').controller("mainController", function($scope, CustomersService, PrintService, MandalsService, SellerService) {
  $scope.lastCount = -1, $scope.selected = [];
  $scope.getList = function() {
    CustomersService.get({mandalUrl: mandalUrl, limit: 100, lastReferenceID: 0})
    .then(function(response){
      $scope.dataList = response.data.data;
      $scope.total = response.data.total;
      $scope.lastCount = $scope.dataList.length;
    })
  };

  $scope.loadMandal = function(url) {
    mandalUrl = url;
    $scope.dataList = [];
    $scope.getList();
  }

  $scope.loadMore = function() {
    if($scope.lastCount == 100) {
      CustomersService.get({mandalUrl: mandalUrl, limit: 100, lastReferenceID: $scope.dataList[$scope.dataList.length - 1].referenceID})
      .then(function(response) {
        response.data.data.forEach(function(mandal){
          $scope.dataList.push(mandal);
        });
        $scope.lastCount = response.data.data.length;
      })
    }
  }

  $scope.keypress = function ($event){
     if ($event.which == 13){
        $scope.getReports()
     }
  }

  $scope.getReports = function() {
    if(!$scope.reportDate) {
      var date = new Date();
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      if(day < 10)
        day = "0"+day;
      if(month < 10)
        month = "0"+month;
      $scope.reportDate = day+"/"+month+"/"+year;
    }
    CustomersService.reports($scope.reportDate)
    .then(function(response){
      $scope.customers = response.data.data;
    })
  }

  $scope.getData = function() {
    if(id) {
      CustomersService.getDetails(id)
      .then(function(response){
        $scope.data = response.data.data;
        $scope.updateDate();
      })
    } else if(aadhaarNo) {
      CustomersService.search({aadhaarNo: aadhaarNo})
      .then(function(response){
        $scope.data = response.data.data;
        $scope.updateDate();
      })
    }
  }

  $scope.updateDate = function() {
    if($scope.data.disability == true || $scope.data.disability == "true") {
      $scope.data.disability = "true";
    } else {
      $scope.data.disability = "false";
    }

    $scope.unitCost = getUnitCost();
    $scope.balance = 125000 - $scope.unitCost;
    $scope.getMandals();
  }

  function getUnitCost() {
    return (($scope.data.seller &&$scope.data.seller.amount)?$scope.data.seller.amount:0)+(($scope.data.transport)?$scope.data.transport.amount:0)+ (($scope.data.feedCost)?$scope.data.feedCost.amount:0)+ (($scope.data.medicine)?$scope.data.medicine.amount:0);
  }

  $scope.print = function(data) {
    var printableData = PrintService.validateSingle(data);
    PrintService.print(printableData)

  }

  $scope.printList = function() {
    PrintService.printList($scope.selectedList);
  }

  $scope.printSelected = function() {
    PrintService.printList($scope.selected);
  }

  $scope.downloadList = function() {
    download($scope.selected);
  }

  $scope.downloadSelected = function() {
    download($scope.selected);
  }

  function download(list) {
    var data = [];
    list.forEach(function (selected) {
        selected = PrintService.validateSingle(selected);
        data.push({
          "Reference ID": selected.referenceID,
          "Beneficiary Name": selected.name || "",
          "Beneficiary Father": selected.father || "",
          "Beneficiary Aadhaar": selected.aadhaar || "",
          "Beneficiary Mobile": selected.mobile || "",
          "Beneficiary Address": selected.address.village || "",
          "Beneficiary Mandal": selected.address.mandal || "",
          "Gender": selected.gender || "",
          "Caste": selected.caste || "",
          "Income": selected.income || "",
          "Disability": selected.disability || "",
          "Applied Date": selected.appliedDate || "",
          "Beneficiary Bank Name": selected.bank.name || "",
          "Beneficiary Bank Branch": selected.bank.branch || "",
          "Beneficiary Bank IFSC": selected.bank.ifsc || "",
          "Beneficiary Bank Account": selected.bank.account || "",
          "Subsidy: Beneficiary amount": selected.subsidy.amount || "",
          "Subsidy: Proceeding No": selected.subsidy.proceeding.no || "",
          "Subsidy: Proceeding S.No": selected.subsidy.proceeding.sNo || "",
          "Grounding Date": selected.grounding.date || "",
          "Grounding Place": selected.grounding.place || "",
          "Seller Name": selected.seller.name || "",
          "Seller Father name": selected.seller.father || "",
          "Seller Aadhaar": selected.seller.aadhaar || "",
          "Seller Village": selected.seller.village || "",
          "Seller Bank Name": selected.seller.bank.name || "",
          "Seller Bank Account": selected.seller.bank.account || "",
          "Seller Bank IFSC": selected.seller.bank.ifsc || "",
          "Seller Bank Cheque": selected.seller.bank.chequeNo || "",
          "Seller Amount": selected.seller.amount || "",
          "Transporter Amount": selected.transport.name || "",
          "Transporter Vehicle No": selected.transport.vehicle || "",
          "Transport Date": selected.transport.date || "",
          "Amount Paid": selected.transport.amount || ""
        })
    });
    JSONToCSVConvertor(data, "selected_list", true);
  }

  $scope.getMandals = function() {
    $scope.mandals = MandalsService.getMandals();
  }

  $scope.update = function() {
    var data = $scope.data;
    var id = data._id;
    delete data.id;
    CustomersService.edit(id, data)
    .then(function(response){
      window.location.reload();
    })
  }

  $scope.search = function() {
    window.location.href = "/dashboard/search/"+$scope.aadhaarNo;
  }

  $scope.checkSelected = function(data) {
    let index = $scope.selected.map(function(customer) { return customer._id; }).indexOf(data._id);
    if(index < 0)
      $scope.selected.push(data);
    else
      $scope.selected.splice(index, 1);
  }

  $scope.getSeller = function() {
    if($scope.data && $scope.data.seller && $scope.data.seller.aadhaar) {
      SellerService.search({aadhaar: $scope.data.seller.aadhaar})
      .then(function(response){
        $scope.data.seller = response.data.data;
      });
    }
  }

  $scope.getSellers = function() {
    SellerService.get()
    .then(function(response){
      $scope.sellers = response.data.data;
    });
  }

  $scope.getSellerData = function() {
    SellerService.getSellerData(sellerID)
    .then(function(response){
      $scope.seller = response.data.data;
    })
  }

  $scope.updateSeller = function() {
    SellerService.update($scope.seller)
    .then(function(response){
      $scope.seller = response.data.data;
      window.location.reload();
    })
  }

  function JSONToCSVConvertor(JSONData, fileName, ShowLabel) {
      var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
      var CSV = '';
      CSV += '';

      if (ShowLabel) {
          var row = "";

          for (var index in arrData[0]) {

              row += index + ',';
          }

          row = row.slice(0, -1);

          CSV += row + '\r\n';
      }

      for (var i = 0; i < arrData.length; i++) {
          var row = "";

          for (var index in arrData[i]) {
              row += '"' + arrData[i][index] + '",';
          }

          row.slice(0, row.length - 1);

          CSV += row + '\r\n';
      }

      if (CSV == '') {
          alert("Invalid data");
          return;
      }

      var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

      var link = document.createElement("a");
      link.href = uri;

      link.style = "visibility:hidden";
      link.download = fileName + ".csv";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }


});

angular.module('nlmsApp').service('PrintService', function(){
  var printer = {};

  printer.printList = function printList(list){
    var mywindow = window.open();
    mywindow.document.write('<html><body>');
    mywindow.document.write("<center><h4 style=\"background-color: #d7dfea;\">Data</h4><center>");
    mywindow.document.write("<table>");
    mywindow.document.write("<tr><td>ID</td><td>Name</td><td>Mobile</td><td>Address</td><td>Gender</td><td>Income</td><td>Bank</td><td>Account</td><td>Applied Date</td></tr>");
    list.forEach(function(d){
      var disability = ((d.disability)?'YES':'NO');
      var bank = d.bank.name+"<br/>"+d.bank.ifsc;
      var name = d.name+"<br/>"+d.father;
      var village = d.address.village;
      mywindow.document.write("<tr><td>"+d.referenceID+"</td><td>"+name+"</td><td>"+d.aadhaar+"<br/>"+d.mobile+"</td><td>"+village+"</td><td>"+d.gender+"<br/>"+d.caste+"</td><td>"+d.income+"<br/>"+disability+"</td><td>"+bank+"</td><td>"+d.bank.account+"</td><td>"+d.appliedDate+"</td></tr>");
    });

    mywindow.document.write("</table>");

    mywindow.document.write('</body></html>');
    mywindow.print();
    mywindow.close();

    return true;
  }

  printer.print = function print(data){
    var mywindow = window.open();
    mywindow.document.write('<html><body>');
    mywindow.document.write("<center><h4>"+data.name+" Details</h4></center>");
    mywindow.document.write("<table><tr><td><table>");
    mywindow.document.write("<tr><td><b>Beneficiary Primary Details</b></td></tr>");
    mywindow.document.write("<tr><td>ID</td><td>"+data.referenceID+"</td></tr>");
    mywindow.document.write("<tr><td>Name</td><td>"+data.name+"</td></tr>");
    mywindow.document.write("<tr><td>Father Name</td><td>"+data.father+"</td></tr>");
    mywindow.document.write("<tr><td>Aadhaar No</td><td>"+data.aadhaar+"</td></tr>");
    mywindow.document.write("<tr><td>Mobile No</td><td>"+data.mobile+"</td></tr>");
    mywindow.document.write("<tr><td>Address</td><td>"+data.address.village+"</td></tr>");
    mywindow.document.write("<tr><td>Mandal</td><td>"+data.address.mandal+"</td></tr>");
    mywindow.document.write("<tr><td>Gender</td><td>"+data.gender+"</td></tr>");
    mywindow.document.write("<tr><td>Caste</td><td>"+data.caste+"</td></tr>");
    mywindow.document.write("<tr><td>Income</td><td>"+data.income+"</td></tr>");
    mywindow.document.write("<tr><td>Disability</td><td>"+((data.disability)?"YES":"NO")+"</td></tr>");
    mywindow.document.write("<tr><td>Applied Date</td><td>"+data.appliedDate+"</td></tr></table><td>");

    mywindow.document.write("<td><table><tr><td><b>Beneficiary Bank Details</b></td></tr>");
    mywindow.document.write("<tr><td>Bank Name</td><td>"+data.bank.name+"</td></tr>");
    mywindow.document.write("<tr><td>Branch Name</td><td>"+data.bank.branch+"</td></tr>");
    mywindow.document.write("<tr><td>Bank IFSC Code</td><td>"+data.bank.ifsc+"</td></tr>");
    mywindow.document.write("<tr><td>Bank Account No</td><td>"+data.bank.account+"</td></tr>");

    mywindow.document.write("<tr><td><b>Subsidy Details</b></td></tr>");
    mywindow.document.write("<tr><td>Beneficiary Contribution Amount</td><td>"+data.subsidy.benificiaryAmount+"</td></tr>");
    mywindow.document.write("<tr><td>Proceeding No</td><td>"+data.subsidy.proceeding.no+"</td></tr>");
    mywindow.document.write("<tr><td>S.No. of Proceeding</td><td>"+data.subsidy.proceeding.sNo+"</td></tr>");
    mywindow.document.write("<tr><td>Subsidy Amount </td><td>"+data.subsidy.amount+"</td></tr>");

    mywindow.document.write("<tr><td><b>Grounding Details</b></td></tr>");
    mywindow.document.write("<tr><td>Grounding Date</td><td>"+data.grounding.date+"</td></tr>");
    mywindow.document.write("<tr><td>Grounding Place</td><td>"+data.grounding.place+"</td></tr></table></td></tr>");

    mywindow.document.write("<tr><td><table><tr><td><b>Seller Details</b></td></tr>");
    mywindow.document.write("<tr><td>Seller Name</td><td>"+data.seller.name+"</td></tr>");
    mywindow.document.write("<tr><td>Seller Father Name</td><td>"+data.seller.father+"</td></tr>");
    mywindow.document.write("<tr><td>Seller Aadhaar No</td><td>"+data.seller.aadhaar+"</td></tr>");
    mywindow.document.write("<tr><td>Seller Village</td><td>"+data.seller.village+"</td></tr>");
    mywindow.document.write("<tr><td>Seller Bank Name</td><td>"+data.seller.bank.name+"</td></tr>");
    mywindow.document.write("<tr><td>Seller Bank Account</td><td>"+data.seller.bank.account+"</td></tr>");
    mywindow.document.write("<tr><td>Seller Bank IFSC</td><td>"+data.seller.bank.ifsc+"</td></tr>");
    mywindow.document.write("<tr><td>Seller Cheque No</td><td>"+data.seller.bank.chequeNo+"</td></tr>");
    mywindow.document.write("<tr><td>Seller Amount</td><td>"+data.seller.amount+"</td></tr></table></td>");

    mywindow.document.write("<td><table><tr><td><b>Transporter Details</b></td></tr>");
    mywindow.document.write("<tr><td>Transporter Name</td><td>"+data.transport.name+"</td></tr>");
    mywindow.document.write("<tr><td>Vehicle No</td><td>"+data.transport.vehicle+"</td></tr>");
    mywindow.document.write("<tr><td>Date of Transport</td><td>"+data.transport.date+"</td></tr>");
    mywindow.document.write("<tr><td>Amount Paid</td><td>"+data.transport.amount+"</td></tr>");

    mywindow.document.write("<tr><td><b>Feed Cost Details</b></td></tr>");
    mywindow.document.write("<tr><td>Quantity</td><td>"+data.feedCost.quantity+"</td></tr>");
    mywindow.document.write("<tr><td>Date</td><td>"+data.feedCost.date+"</td></tr>");
    mywindow.document.write("<tr><td>Amount</td><td>"+data.feedCost.amount+"</td></tr></table></td>");

    mywindow.document.write("<td><table><tr><td><b>Medicine Supply Details</b></td></tr>");
    mywindow.document.write("<tr><td>Name</td><td>"+data.medicine.name+"</td></tr>");
    mywindow.document.write("<tr><td>Date</td><td>"+data.feedCost.date+"</td></tr>");
    mywindow.document.write("<tr><td>Amount</td><td>"+data.feedCost.amount+"</td></tr>");
    if(data.unitCost) {
      mywindow.document.write("<td><table><tr><td><b>Reimbursement Details</b></td></tr>");
      mywindow.document.write("<tr><td>Unit Cost</td><td> INR: "+data.unitCost+"</td></tr>");
      mywindow.document.write("<tr><td>Balance</td><td> INR: "+data.balance+"</td></tr>");
      if(data.forBeneficiary)
        mywindow.document.write("<tr><td>For Beneficiary</td><td> INR: "+data.forBeneficiary+"</td></tr>");

      if(data.forGovt)
        mywindow.document.write("<tr><td>For Governament</td><td> INR: "+data.forGovt+"</td></tr>");
    }
    mywindow.document.write("</table></td></tr></table>");
    mywindow.document.write('</body></html>');
    mywindow.print();
    mywindow.close();

    return true;
  }

  printer.validateSingle = function validateSingle(data) {
    var unitCost = ((data.seller && parseInt(data.seller.amount))?data.seller.amount:0)+((data.transport && parseInt(data.transport.amount))?data.transport.amount:0)+ ((data.feedCost && parseInt(data.feedCost.amount))?data.feedCost.amount:0)+ ((data.medicine && parseInt(data.medicine.amount))?data.medicine.amount:0);
    return {
      referenceID: data.referenceID || " ",
      name: data.name || " ",
      father: data.father || " ",
      aadhaar: data.aadhaar || " ",
      mobile: data.mobile || " ",
      address: {
        village: (data.address && data.address.village)?data.address.village:" ",
        mandal: (data.address && data.address.mandal)?data.address.mandal:" ",
        district: (data.address && data.address.district)?data.address.district:" "
      },
      gender: data.gender || " ", //male, female
      caste: data.caste || " ",
      income: data.income || " ",
      disability: data.disability || " ",
      proceeding: {
        no: (data.proceeding && data.proceeding.no)?data.proceeding.no:" ",
        sNo: (data.proceeding && data.proceeding.sNo)?data.proceeding.sNo:" "
      },
      appliedDate: data.appliedDate || " ",

      bank: {
        name: (data.bank && data.bank.name)?data.bank.name:" ",
        branch: (data.bank && data.bank.branch)?data.bank.branch:" ",
        ifsc: (data.bank && data.bank.ifsc)?data.bank.ifsc:" ",
        account: (data.bank && data.bank.account)?data.bank.account:" "
      },
      subsidy: {
        benificiaryAmount: (data.subsidy && data.subsidy.benificiaryAmount)?data.subsidy.benificiaryAmount:" ",
        proceeding: {
          no: (data.subsidy && data.subsidy.proceeding && data.subsidy.proceeding.no)?data.subsidy.proceeding.no:" ",
          sNo: (data.subsidy && data.subsidy.proceeding && data.subsidy.proceeding.sNo)?data.subsidy.proceeding.sNo:" ",
        },
        amount: (data.subsidy && data.subsidy.amount)?data.subsidy.amount:" "
      },
      grounding: {
        date: (data.grounding && data.grounding.date)?data.grounding.date:" ",
        place: (data.grounding && data.grounding.place)?data.grounding.place:" "
      },
      seller: {
        name: (data.seller && data.seller.name)?data.seller.name:" ",
        father: (data.seller && data.seller.father)?data.seller.father:" ",
        aadhaar: (data.seller && data.seller.aadhaar)?data.seller.aadhaar:" ",
        village: (data.seller && data.seller.village)?data.seller.village:" ",
        bank: {
          name: (data.seller && data.seller.bank && data.seller.bank.name)?data.seller.bank.name:" ",
          account: (data.seller && data.seller.bank && data.seller.bank.account)?data.seller.bank.account:" ",
          ifsc: (data.seller && data.seller.bank && data.seller.bank.ifsc)?data.seller.bank.ifsc:" ",
          chequeNo: (data.seller && data.seller.bank && data.seller.bank.chequeNo)?data.seller.bank.chequeNo:" ",
        },
        amount: (data.seller && data.seller.amount)?data.seller.amount:" ",
      },
      transport: {
        name: (data.transport && data.transport.name)?data.transport.name:" ",
        vehicle: (data.transport && data.transport.vehicle)?data.transport.vehicle:" ",
        date: (data.transport && data.transport.date)?data.transport.date:" ",
        amount: (data.transport && data.transport.amount)?data.transport.amount:" ",
      },
      feedCost: {
        quantity: (data.feedCost && data.feedCost.quantity)?data.feedCost.quantity:" ",
        date: (data.feedCost && data.feedCost.date)?data.feedCost.date:" ",
        amount: (data.feedCost && data.feedCost.amount)?data.feedCost.amount:" "
      },
      medicine: {
        name: (data.medicine && data.medicine.name)?data.medicine.name:" ",
        amount: (data.medicine && data.medicine.amount)?data.medicine.amount:" ",
        date: (data.medicine && data.medicine.date)?data.medicine.date:" ",
      },
      unitCost: unitCost,
      balance: 125000 - unitCost,
      forBeneficiary: ((125000 - unitCost) > 0)?((125000 - unitCost) * 0.25): 0,
      forGovt: ((125000 - unitCost) > 0)?((125000 - unitCost) * 0.75): 0,
    }
  }

  return printer;
})

angular.module('nlmsApp').factory('CustomersService', function($http) {
    var customers = {};

    customers.add = function add(data){
      return $http.post('/customers/add', data);
    }

    customers.get = function get(data){
      return $http.post('/customers/get', data);
    }

    customers.getDetails = function getDetails(id){
      return $http.get('/customers/'+id);
    }

    customers.search = function search(data) {
      return $http.post('/customers/search', data);
    }

    customers.edit = function edit(id, data){
      return $http.put('/customers/'+id, data);
    }

    customers.reports = function reports(date) {
      return $http.post('/customers/reports', {date: date});
    }

    return customers;
});

angular.module('nlmsApp').factory('SellerService', function($http) {
    var sellers = {};

    sellers.get = function get(){
      return $http.get('/sellers/get');
    }

    sellers.getSellerData = function getSellerData(sellerID){
      return $http.get('/sellers/get/'+sellerID);
    }

    sellers.search = function search(data){
      return $http.post('/sellers/search', data);
    }

    sellers.update = function update(data){
      return $http.put('/sellers/'+data._id, data);
    }

    return sellers;
});

angular.module('nlmsApp').factory('MandalsService', function(){
  var mandals = {};

  mandals.getMandals = function mandals(){
    var mandals = [{"name": "Adavidevulapalli", "url": "adavidevulapally"},
    {"name": "Anumula Haliya", "url": "anumula-haliya"},
    {"name": "Chandampeta", "url": "chandampeta"},
    {"name": "Chandur", "url":"chandur"},
    {"name": "Chityal", "url": "chityal"},
    {"name": "Dameracherla", "url": "dameracherla"},
    {"name": "Gurrampode", "url": "gurrampode"},
    {"name": "Gundlapally", "url": "gundlapally"},
    {"name": "Kanagal", "url": "kanagal"},
    {"name": "Kattangur", "url": "kattangur"},
    {"name": "Kethepally", "url": "kethepally"},
    {"name": "Konda Mallepally", "url": "konda-mallepally"},
    {"name": "Munugode", "url": "munugode"},
    {"name": "Madugulapalli", "url": "madugulapalliode"},
    {"name": "Miryalaguda", "url": "miryalaguda"},
    {"name": "Narketpally", "url": "narketpally"},
    {"name": "Nampally", "url": "nampally"},
    {"name": "Nidmanoor", "url": "nidmanoor"},
    {"name": "Tirumalagiri Sagar", "url": "tirumalagiri-sagar"},
    {"name": "Tripuraram", "url": "tripuraram"},
    {"name": "Chinthapally", "url": "chinthapally"},
    {"name": "Neredugommu", "url": "neredugommu"},
    {"name": "Peddavoora", "url": "peddavoora"},
    {"name": "Marriguda", "url": "marriguda"},
    {"name": "Pedda Adesherla", "url": "pedda-adesherla"},
    {"name": "Nalgonda", "url": "nalgonda"},
    {"name": "Thipparthy", "url": "thipparthy"},
    {"name": "Nakrekal", "url": "nakrekal"},
    {"name": "Shaligouraram", "url": "shaligouraram"},
    {"name": "Devarakonda", "url": "devarakonda"},
    {"name": "Vemulapally", "url": "vemulapally"}]

    return mandals;

  }

  return mandals;
})
