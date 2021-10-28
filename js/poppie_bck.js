var width = 960,
    height = 700,
    radius = Math.min(width, height) / 2;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2.3 + "," + height * .5 + ")");

var partition = d3.layout.partition()
    .sort(null)
    .size([2 * Math.PI, radius * radius])
    .value(function(d) { return d.size1870; });

	
var x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

var y = d3.scale.linear()
    .range([0, radius]);

var co1870=39864;
var co1880=194327;
var co1890=413249;
var co1900=539700;
var co1910=799024;
var co1920=939629;
var co1930=1035791;
var co1940=1123296;
var co1950=1325089;
var co1960=1753947;
var co1970=2207259;
var co1980=2889964;
var co1990=3294394;
var co2000=4301262;
var co2010=5029196;	
var co2020=5773714;
	
var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y)*.5; })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy)*1; });

	var  partition2 = d3.layout.partition()
    .sort(null)
    .value(function(d) { return eval('d.size'+$('#year').html()); });

var path, text, h;	
	
d3.json("js/flare.json", function(error, root) {
  path = svg.datum(root).selectAll("path")
      .data(partition.nodes)
    .enter().append("path")
      .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
      .attr("d", arc)
      .style("stroke", "#fff")
      .style("fill", function(d) { return d.color; })
      .style("fill-rule", "evenodd")
	 .on("mouseover", function(d) {
	    var popyear=eval('d.size'+$('#year').html());
		var copop=eval('co'+$('#year').html());
		tooltip.show([d3.event.clientX,d3.event.clientY],'<div>Year: '+ $('#year').html() +'</div><div><b>'+d.name+'</b></div><div>Population: '+commafy(popyear)+'</div><div>State Share: ' + ((popyear/copop)*100).toFixed(1) + '%</div>')
       })
        .on('mouseout',function(){
            tooltip.cleanup()
        })  
      .each(stash);

	  	 h = svg.selectAll("g")
      .data(partition2.nodes(root))
    .enter().append("g");
	
  text = h.append("text")
    .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
    .attr("x", function(d) { return y(d.y); })
    .attr("dx", "15") // margin
    .attr("dy", ".35em") // vertical-align
    .attr("class", "ltext") // vertical-align
    .style("visibility", function(d) { var curyear = parseInt($('#year').html()); var testvar = eval('d.size'+curyear); var retvar; if(testvar>0){ retvar=""; }else{retvar="hidden";} return retvar; })
    .text(function(d) { return d.name; });
	
});

var timeout;


function commafy(nStr) {
	var x, x1, x2, rgx;

	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}


  function turndata(yearstr, auto) {
  
  if(auto==1){timeout=0}; //if manually press button, animate ends
    
    var value = this.value === "count"
        ? function(d) { return eval('d.size'+yearstr); }
        : function(d) { return eval('d.size'+yearstr); };

			  	 svg.selectAll("text")
        .data(partition2.value(value).nodes)
      .transition()
        .duration(1500)
		 .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
		 .style("visibility", function(d) { 
		 var retvar; 
		 var curyear = parseInt(yearstr); 
		 if(curyear>2020){retvar="";}else{var testvar = eval('d.size'+curyear); if(testvar>0){ retvar=""; }else{retvar="hidden";}}
		 return retvar; })
		.ease("linear");
		
		
    path.data(partition.value(value).nodes)
      .transition()
        .duration(1500)
        .attrTween("d", arcTween)
		.ease("linear");
		

	 setTimeout(function(){$('#year').html(yearstr); if(timeout>0){animateall();}},1300);
	 
  };  
  
  
  function animateall(){
  var curyear=parseInt($('#year').html());
  //alert(curyear);
  
  if(curyear==2020){curyear=1870;}
  
  	timeout=1000;
  
	curyear=curyear+10; 
	turndata(String(curyear),0)
	
	if(curyear>2010){timeout=0;}
  
  }

// Stash the old values for transition.
function stash(d) {
  d.x0 = d.x;
  d.dx0 = d.dx;
}

// Interpolate the arcs in data space.
function arcTween(a) {
  var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
  return function(t) {
    var b = i(t);
    a.x0 = b.x;
    a.dx0 = b.dx;
    return arc(b);
  };
}


function computeTextRotation(d) {
  return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
}


(function() {

  var tooltip = window.tooltip = {};

  tooltip.show = function(pos, content, gravity, dist, parentContainer, classes) {

    var container = d3.select('body').selectAll('.tooltip').data([1]);

        container.enter().append('div').attr('class', 'tooltip ' + (classes ? classes : 'xy-tooltip'));

        container.html(content);

    gravity = gravity || 'n';
    dist = dist || 20;

    var body = document.getElementsByTagName('body')[0];

    var height = parseInt(container[0][0].offsetHeight)
      , width = parseInt(container[0][0].offsetWidth)
      , windowWidth = window.innerWidth
      , windowHeight = window.innerHeight
      , scrollTop = body.scrollTop
      , scrollLeft = body.scrollLeft
      , left = 0
      , top = 0;


    switch (gravity) {
      case 'e':
        left = pos[0] - width - dist;
        top = pos[1] - (height / 2);
        if (left < scrollLeft) left = pos[0] + dist;
        if (top < scrollTop) top = scrollTop + 5;
        if (top + height > scrollTop + windowHeight) top = scrollTop - height - 5;
        break;
      case 'w':
        left = pos[0] + dist;
        top = pos[1] - (height / 2);
        if (left + width > windowWidth) left = pos[0] - width - dist;
        if (top < scrollTop) top = scrollTop + 5;
        if (top + height > scrollTop + windowHeight) top = scrollTop - height - 5;
        break;
      case 's':
        left = pos[0] - (width / 2);
        top = pos[1] + dist;
        if (left < scrollLeft) left = scrollLeft + 5;
        if (left + width > windowWidth) left = windowWidth - width - 5;
        if (top + height > scrollTop + windowHeight) top = pos[1] - height - dist;
        break;
      case 'n':
        left = pos[0] - (width / 2);
        top = pos[1] - height - dist;
        if (left < scrollLeft) left = scrollLeft + 5;
        if (left + width > windowWidth) left = windowWidth - width - 5;
        if (scrollTop > top) top = pos[1] + 20;
        break;
    }


    container.style('left', left+'px');
    container.style('top', top+'px');

    return container;
  }

  tooltip.cleanup = function() {
      // Find the tooltips, mark them for removal by this class (so other tooltip functions won't find it)
      var tooltips = d3.selectAll('.tooltip').attr('class','tooltip-pending-removal').transition().duration(250).style('opacity',0).remove();

  }
})()

d3.select(self.frameElement).style("height", height + "px");