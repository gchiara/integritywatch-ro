import jquery from 'jquery';
window.jQuery = jquery;
window.$ = jquery;
require( 'datatables.net' )( window, $ )
require( 'datatables.net-dt' )( window, $ )

import underscore from 'underscore';
window.underscore = underscore;
window._ = underscore;

import '../public/vendor/js/popper.min.js'
import '../public/vendor/js/bootstrap.min.js'
import { csv } from 'd3-request'
import { json } from 'd3-request'

import '../public/vendor/css/bootstrap.min.css'
import '../public/vendor/css/dc.css'
import '/scss/main.scss';

import Vue from 'vue';
import Loader from './components/Loader.vue';
import ChartHeader from './components/ChartHeader.vue';


// Data object - is also used by Vue

var vuedata = {
  page: 'meetings',
  loader: true,
  showInfo: true,
  showShare: true,
  chartMargin: 40,
  selectedMandate: 'all',
  charts: {
    mandateSelector: {
      title: 'Selectați legislatura',
      info: 'Lorem ipsum'
    },
    institution: {
      title: 'Top 20 instituții',
      info: 'Lorem ipsum'
    },
    institutionCategory: {
      title: 'Tipul instituției',
      info: 'Lorem ipsum'
    },
    topOfficials: {
      title: 'Top 10 demnitari',
      info: 'Lorem ipsum'
    },
    role: {
      title: 'Funcția demnitarilor',
      info: 'Lorem ipsum'
    },
    subjects: {
      title: 'Subiecte abordate',
      info: 'Lorem ipsum'
    },
    table: {
      chart: null,
      type: 'table',
      title: 'Întâlniri',
      info: 'Lorem ipsum'
    }
  },
  selectedEl: {"Name": ""},
  colors: {
    default: "#009fe2",
    range: ["#62aad9", "#3b95d0", "#1a6da3", "#085c9c", "#e3b419", "#e39219", "#de7010"],
    colorSchemeCloud: ["#62aad9", "#3b95d0", "#b7bebf", "#1a6da3", "#e3b419", "#e39219", "#de7010"],
    numPies: {
      "0": "#ddd",
      "1": "#ff516a",
      "2": "#f43461",
      "3": "#e51f5c",
      "4": "#d31a60",
      ">5": "#bb1d60"
    }
  }
}

//Set vue components and Vue app

Vue.component('chart-header', ChartHeader);
Vue.component('loader', Loader);

new Vue({
  el: '#app',
  data: vuedata,
  methods: {
    //Share
    share: function (platform) {
      if(platform == 'twitter'){
        var thisPage = window.location.href.split('?')[0];
        var shareText = 'Integrity Watch Romania ' + thisPage;
        var shareURL = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText);
        window.open(shareURL, '_blank');
        return;
      }
      if(platform == 'facebook'){
        //var toShareUrl = window.location.href.split('?')[0];
        var toShareUrl = 'https://integritywatch.ro';
        var shareURL = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(toShareUrl);
        window.open(shareURL, '_blank', 'toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250,top=300,left=300');
        return;
      }
    }
  }
});

//Initialize info popovers
$(function () {
  $('[data-toggle="popover"]').popover()
})


//Charts

var charts = {
  institution: {
    chart: dc.rowChart("#institution_chart"),
    type: 'row',
    divId: 'institution_chart'
  },
  institutionCategory: {
    chart: dc.pieChart("#institutioncategory_chart"),
    type: 'pie',
    divId: 'institutioncategory_chart'
  },
  topOfficials: {
    chart: dc.rowChart("#topofficials_chart"),
    type: 'row',
    divId: 'topofficials_chart'
  },
  role: {
    chart: dc.pieChart("#role_chart"),
    type: 'pie',
    divId: 'role_chart'
  },
  subjects: {
    chart: dc.wordCloud("#subjects_chart"),
    type: 'cloud',
    divId: 'subjects_chart'
  },
  table: {
    chart: null,
    type: 'table',
    divId: 'dc-data-table'
  }
}

//Functions for responsivness
var recalcWidth = function(divId) {
  return document.getElementById(divId).offsetWidth - vuedata.chartMargin;
};
var recalcWidthWordcloud = function() {
  //Replace element if with wordcloud column id
  var width = document.getElementById("wordcloud_chart_col").offsetWidth - vuedata.chartMargin*2;
  return [width, 410];
};
var recalcCharsLength = function(width) {
  return parseInt(width / 8);
};
var calcPieSize = function(divId) {
  var newWidth = recalcWidth(divId);
  var sizes = {
    'width': newWidth,
    'height': 0,
    'radius': 0,
    'innerRadius': 0,
    'cy': 0,
    'legendY': 0
  }
  if(newWidth < 300) { 
    sizes.height = newWidth + 170;
    sizes.radius = (newWidth)/2;
    sizes.innerRadius = (newWidth)/4;
    sizes.cy = (newWidth)/2;
    sizes.legendY = (newWidth) + 30;
  } else {
    sizes.height = newWidth*0.75 + 170;
    sizes.radius = (newWidth*0.75)/2;
    sizes.innerRadius = (newWidth*0.75)/4;
    sizes.cy = (newWidth*0.75)/2;
    sizes.legendY = (newWidth*0.75) + 30;
  }
  return sizes;
};
var resizeGraphs = function() {
  for (var c in charts) {
    var sizes = calcPieSize(charts[c].divId);
    var newWidth = recalcWidth(charts[c].divId);
    var charsLength = recalcCharsLength(newWidth);
    if(charts[c].type == 'row'){
      charts[c].chart.width(newWidth);
      charts[c].chart.label(function (d) {
        var thisKey = d.key;
        if(thisKey.indexOf('###') > -1){
          thisKey = thisKey.split('###')[0];
        }
        if(thisKey.length > charsLength){
          return thisKey.substring(0,charsLength) + '...';
        }
        return thisKey;
      })
      charts[c].chart.redraw();
    } else if(charts[c].type == 'bar') {
      charts[c].chart.width(newWidth);
      charts[c].chart.rescale();
      charts[c].chart.redraw();
    } else if(charts[c].type == 'pie') {
      charts[c].chart
        .width(sizes.width)
        .height(sizes.height)
        .cy(sizes.cy)
        .innerRadius(sizes.innerRadius)
        .radius(sizes.radius)
        .legend(dc.legend().x(0).y(sizes.legendY).gap(10).autoItemWidth(true).horizontal(true).legendWidth(sizes.width));
        //.legend(dc.legend().x(0).y(sizes.legendY).gap(10));
      charts[c].chart.redraw();
    } else if(charts[c].type == 'cloud') {
      charts[c].chart.size(recalcWidthWordcloud());
      charts[c].chart.redraw();
    }
  }
};

//Add commas to thousands
function addcommas(x){
  if(parseInt(x)){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return x;
}
//Custom date order for dataTables
var dmy = d3.timeParse("%d/%m/%Y");
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "date-eu-pre": function (date) {
    if(date.indexOf("Cancelled") > -1){
      date = date.split(" ")[0];
    }
      return dmy(date);
  },
  "date-eu-asc": function (a, b) {
      return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "date-eu-desc": function ( a, b ) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});

//Custom ordering for start and end dates
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "meeting-time-pre": function (a) {
    var monthToNum = {
      "ianuarie": "01",
      "februarie": "02",
      "martie": "03",
      "aprilie": "04",
      "mai": "05",
      "iunie": "06",
      "iulie": "07",
      "august": "08",
      "septembrie": "09",
      "octombrie": "10",
      "noiembrie": "11",
      "decembrie": "12"
    }
    //Turn datetime string into int
    var datetimeSplit = a.split('@');
    var timeStr = datetimeSplit[1].trim().replace(':','');
    if(timeStr.length == 3) { timeStr = "0"+timeStr; }
    var dateSplit = datetimeSplit[0].split(' ');
    var y = dateSplit[2];
    var m = monthToNum[dateSplit[1]];
    var d = dateSplit[0];
    if(d.length == 1) { d = "0"+d; }
    var datetimeString = y+m+d+timeStr;
    return parseInt(datetimeString);
  },
  "meeting-time-asc": function (a, b) {
    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "meeting-time-desc": function (a, b) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});

//Load data and generate charts
//Generate random parameter for dynamic dataset loading (to avoid caching)

var randomPar = '';
var randomCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
for ( var i = 0; i < 5; i++ ) {
  randomPar += randomCharacters.charAt(Math.floor(Math.random() * randomCharacters.length));
}

json('./data/meetings.json?' + randomPar, (err, meetings) => {
  //Parse data
  _.each(meetings, function (d) {
    //Refine streamlining of institutions
    d.decident_institution_streamlined_refined = d.decident_institution_streamlined;
    if(d.decident_institution_streamlined.indexOf('Ministerul') > -1) {
      d.decident_institution_streamlined_refined = 'Ministerul';
    }
    if(d.decident_institution_streamlined == '') {
      d.decident_institution_streamlined_refined = 'N/A';
    }
  });

  //Set dc main vars
  var ndx = crossfilter(meetings);
  var searchDimension = ndx.dimension(function (d) {
      var entryString = "" + d.title + " " + d.topic + " " + d.decident + " " + d.decident_institution;
      return entryString.toLowerCase();
  });
  var mandateDimension = ndx.dimension(function (d) {
    return d.legislature;
  });

  //CHART 1 - Institution
  var createInstitutionChart = function() {
    var chart = charts.institution.chart;
    var dimension = ndx.dimension(function (d) {
        //return d.decident_institution_streamlined_refined;
        return d.decident_institution;
    }, false);
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(20).filter(function(d) {
            return true;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.institution.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(820)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);
    chart.render();
  }

  //CHART 2 - Institutions Categories
  var createInstitutionCategoryChart = function() {
    var chart = charts.institutionCategory.chart;
    var dimension = ndx.dimension(function (d) {
      return d.decident_institution_streamlined_refined;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.institutionCategory.divId);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .cap(7)
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(10).autoItemWidth(true).horizontal(true).legendWidth(sizes.width).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey.length > 40){
          return thisKey.substring(0,40) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        var thisKey = d.key;
        return thisKey + ': ' + d.value;
      })
      .dimension(dimension)
      //.ordinalColors(vuedata.colors.range)
      .colorCalculator(function(d, i) {
        if(d.key == "Others") {
          return "#ddd";
        }
        return vuedata.colors.range[i];
      })
      .group(group);

    chart.render();
  }

  //CHART 2 - Top Officials
  var createTopOfficialsChart = function() {
    var chart = charts.topOfficials.chart;
    var dimension = ndx.dimension(function (d) {
      return d.decident;
    });
    var group = dimension.group().reduceSum(function (d) {
      return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(10).filter(function(d) {
            return (d.value != 0);
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.topOfficials.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(450)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);
    chart.render();
  }

  //CHART 3 - ROLES
  var createRoleChart = function() {
    var chart = charts.role.chart;
    var dimension = ndx.dimension(function (d) {
      if(d.decident_role_streamlined == "") {
        return "N/A";
      }
      return d.decident_role_streamlined;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.role.divId);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .cap(7)
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(10).autoItemWidth(true).horizontal(true).legendWidth(sizes.width).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey.length > 40){
          return thisKey.substring(0,40) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        var thisKey = d.key;
        return thisKey + ': ' + d.value;
      })
      .dimension(dimension)
      //.ordinalColors(vuedata.colors.range)
      .colorCalculator(function(d, i) {
        if(d.key == "Others") {
          return "#ddd";
        }
        return vuedata.colors.range[i];
      })
      .group(group);

    chart.render();
  }

  //CHART 4
  var createSubjectsChart = function() {
    var chart = charts.subjects.chart;
    var dimension = ndx.dimension(function(d) {
      return d.title || "";
    })
    var group = dimension.group().reduceSum(function(d) { return 1; });
    chart
    .dimension(dimension)
    .group(group)
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .maxWords(110)
    .scale(d3.scaleLinear().domain([2,50]).range([10, 35]))
    .timeInterval(10)
    .duration(200)
    .ordinalColors(vuedata.colors.colorSchemeCloud)
    .size(recalcWidthWordcloud())
    .font("Impact")
    .stopWords(/^(și|pentru|în|din|de|al|a|l|la|le|li|cu|–|of|pe)$/)
    .onClick(function(d){setword(d.key);})
    .textAccessor(function(d) {return d.title;});
    chart.size(recalcWidthWordcloud());
    chart.render();
  }

  //TABLE
  var createTable = function() {
    var count=0;
    charts.table.chart = $("#dc-data-table").dataTable({
      "columnDefs": [
        {
          "searchable": false,
          "orderable": false,
          "targets": 0,   
          data: function ( row, type, val, meta ) {
            return count;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 1,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.decident;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 2,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.decident_role;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 3,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.decident_institution;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 4,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.title;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 5,
          "defaultContent":"N/A",
          "type": "meeting-time",
          "data": function(d) {
            return d.startTime;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 6,
          "defaultContent":"N/A",
          "type": "meeting-time",
          "data": function(d) {
            return d.endTime;
          }
        }
      ],
      "iDisplayLength" : 25,
      "bPaginate": true,
      "bLengthChange": true,
      "bFilter": false,
      "order": [[ 5, "desc" ]],
      "bSort": true,
      "bInfo": true,
      "bAutoWidth": false,
      "bDeferRender": true,
      "aaData": searchDimension.top(Infinity),
      "bDestroy": true,
    });
    var datatable = charts.table.chart;
    datatable.on( 'draw.dt', function () {
      var PageInfo = $('#dc-data-table').DataTable().page.info();
        datatable.DataTable().column(0, { page: 'current' }).nodes().each( function (cell, i) {
            cell.innerHTML = i + 1 + PageInfo.start;
        });
      });
      datatable.DataTable().draw();

    $('#dc-data-table tbody').on('click', 'tr', function () {
      var data = datatable.DataTable().row( this ).data();
      vuedata.selectedEl = data;
      console.log(vuedata.selectedEl);
      $('#detailsModal').modal();
    });
  }
  //REFRESH TABLE
  function RefreshTable() {
    dc.events.trigger(function () {
      var alldata = searchDimension.top(Infinity);
      charts.table.chart.fnClearTable();
      charts.table.chart.fnAddData(alldata);
      charts.table.chart.fnDraw();
    });
  }

  //SEARCH INPUT FUNCTIONALITY
  var typingTimer;
  var doneTypingInterval = 1000;
  var $input = $("#search-input");
  $input.on('keyup', function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  });
  $input.on('keydown', function () {
    clearTimeout(typingTimer);
  });
  function doneTyping () {
    var s = $input.val().toLowerCase();
    searchDimension.filter(function(d) { 
      return d.indexOf(s) !== -1;
    });
    throttle();
    var throttleTimer;
    function throttle() {
      window.clearTimeout(throttleTimer);
      throttleTimer = window.setTimeout(function() {
          dc.redrawAll();
      }, 250);
    }
  }

  //Set word for wordcloud
  var setword = function(wd) {
    //console.log(charts.subject.chart);
    $("#search-input").val(wd);
    var s = wd.toLowerCase();
    searchDimension.filter(function(d) { 
      return d.indexOf(s) !== -1;
    });
    throttle();
    var throttleTimer;
    function throttle() {
      window.clearTimeout(throttleTimer);
      throttleTimer = window.setTimeout(function() {
        console.log ("redraw");
          dc.redrawAll();
      }, 250);
    }
  }

  //Reset charts
  var resetGraphs = function() {
    for (var c in charts) {
      if(charts[c].type !== 'table' && charts[c].chart.hasFilter()){
        charts[c].chart.filterAll();
      }
    }
    vuedata.selectedMandate = 'all';
    searchDimension.filter(null);
    mandateDimension.filter(null);
    $('#search-input').val('');
    dc.redrawAll();
  }
  $('.reset-btn').click(function(){
    resetGraphs();
  })

  //Mandate selector
  $( "#mandateSelector" ).change(function() {
    mandateDimension.filter(function(d) { 
      if(vuedata.selectedMandate == 'all') {
        return true;
      } else {
        return d == vuedata.selectedMandate;
      }
    });
    dc.redrawAll();
  });
  
  //Render charts
  createInstitutionChart();
  createInstitutionCategoryChart();
  createTopOfficialsChart();
  createRoleChart();
  createSubjectsChart();
  createTable();

  $('.dataTables_wrapper').append($('.dataTables_length'));

  //Hide loader
  vuedata.loader = false;

  //COUNTERS
  //Main counter
  var all = ndx.groupAll();
  var counter = dc.dataCount('.dc-data-count')
    .dimension(ndx)
    .group(all);
  counter.render();
  counter.on("renderlet.resetall", function(c) {
    RefreshTable();
  });

  //Window resize function
  window.onresize = function(event) {
    resizeGraphs();
  };

});
