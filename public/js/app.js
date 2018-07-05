'use strict';

angular.module('nlmsApp', []);

angular.module('nlmsApp').controller("mainController", function($scope, CustomersService, PrintService, MandalsService) {
  $scope.lastCount = -1;
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

  $scope.getData = function() {
    CustomersService.getDetails(id)
    .then(function(response){
      $scope.data = response.data.data;
    })
  }

  $scope.print = function(data) {
    PrintService.print(data)
  }

  $scope.printList = function() {
    PrintService.printList($scope.selectedList);
  }

  $scope.getMandals = function() {
    $scope.mandals = MandalsService.getMandals();
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
    mywindow.document.write("<center><h4 style=\"background-color: #d7dfea;\">"+data.name+" Information</h4><center>");
    mywindow.document.write("<table>");
    mywindow.document.write("<tr><td>ID</td><td>"+data.referenceID+"</td></tr>");
    mywindow.document.write("<tr><td>Name</td><td>"+data.name+"</td></tr>");
    mywindow.document.write("<tr><td>Father Name</td><td>"+data.father+"</td></tr>");
    mywindow.document.write("<tr><td>Aadhaar No</td><td>"+data.aadhaar+"</td></tr>");
    mywindow.document.write("<tr><td>Mobile No</td><td>"+data.mobile+"</td></tr>");
    mywindow.document.write("<tr><td>Address</td><td>"+data.address.village+"</td></tr>");
    mywindow.document.write("<tr><td>Gender</td><td>"+data.gender+"</td></tr>");
    mywindow.document.write("<tr><td>Caste</td><td>"+data.caste+"</td></tr>");
    mywindow.document.write("<tr><td>Income</td><td>"+data.income+"</td></tr>");
    mywindow.document.write("<tr><td>Disability</td><td>"+((data.disability)?"YES":"NO")+"</td></tr>");
    mywindow.document.write("<tr><td>Bank Name</td><td>"+data.bank.name+"</td></tr>");
    mywindow.document.write("<tr><td>Bank IFSC Code</td><td>"+data.bank.ifsc+"</td></tr>");
    mywindow.document.write("<tr><td>Bank Account No</td><td>"+data.bank.account+"</td></tr>");
    mywindow.document.write("<tr><td>Applied Date</td><td>"+data.appliedDate+"</td></tr>");
    mywindow.document.write("</table>");

    mywindow.document.write('</body></html>');
    mywindow.print();
    mywindow.close();

    return true;
  }

  return printer;
})

angular.module('nlmsApp').factory('CustomersService', function($http) {
    var nlms = {};

    nlms.add = function add(data){
      return $http.post('/customers/add', data);
    }

    nlms.get = function get(data){
      return $http.post('/customers/get', data);
    }

    nlms.getDetails = function getDetails(id){
      return $http.get('/customers/'+id);
    }

    nlms.edit = function edit(id, data){
      return $http.post('/customers/edit/'+id, data);
    }


    return nlms;
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