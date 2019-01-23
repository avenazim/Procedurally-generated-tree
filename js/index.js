var branches = [];
var seed = {
			i: 0,
			x: 900,
			y: 800,
			a: 0,
			l: 90,
			d: 0
		};
var levels = 9;
var length = 0.75;
var angle = 0.6;

var colorTrunk = ["#423a38","#3c3331","#3e3230","#584846","#483d3c","#544b4a","#463c3b"];
var colorBranch = ["#678d4b","#416d50","#0b2b3b", "#1c484f", "#05161f", "#113342", "#224f50", "#29574d", "#092432", "#09212f"];

var leaves = ["images/ewa1.png", "images/ewa2.png", "images/ewa3.png", "images/ewa4.png", "images/ewa5.png", "images/g.png"];


    

function randomColor(opacity){
  function rChannel(opacity){
    var a = 255-opacity;
    var rColor = 0|((Math.random() * a) + opacity);
    var colorString = rColor.toString(16);
    return (colorString.length==1) ? '0'+ colorString : colorString;
  }
  return '#' + rChannel(opacity) + rChannel(opacity) + rChannel(opacity);
}

function trunk(b) {

	var endoOfPreviousBranch = endPoint(b), newBranch;
	branches.push(b);

	if (b.d === levels)
		return;

	L = Math.random() * length + 0.65;
	A = Math.random() * angle + 0.3;


	//Left branch
	newBranch = {
		i: branches.length,
		x: endoOfPreviousBranch.x,
		y: endoOfPreviousBranch.y,
		a: b.a - angle * A,
		l: b.l * length * L,
		d: b.d + 1,
		parent: b.i
	};
	trunk(newBranch);

	//Right branch
		newBranch = {
		i: branches.length,
		x: endoOfPreviousBranch.x,
		y: endoOfPreviousBranch.y,
		a: b.a + angle * A,
		l: b.l * length * L,
		d: b.d + 1,
		parent: b.i
	};
	trunk(newBranch);
}
function endPoint(b) {
	var x = b.x + b.l * Math.sin(b.a);
	var y = b.y - b.l * Math.cos(b.a);
	return {x: x, y: y};
}


function x1(d) {return d.x;}
function y1(d) {return d.y;}
function x2(d) {return endPoint(d).x;}
function y2(d) {return endPoint(d).y;}

function update() {
	
	var updateTree = d3.select('svg')
		.selectAll('line')
			.data(branches)
			.transition()
			.attr('x1', x1)
			.attr('y1', y1)
			.attr('x2', x2)
			.attr('y2', y2)
			.attr('id', function(d) {return 'id-' + d.i;});
		
	var updateleaves = d3.select('svg')
		.selectAll('image')
			.data(branches)
			.transition()
			.attr('x', x2)
			.attr('y', y2)
}
function drawNoErase() {
	d3.select('svg')
		.selectAll('line')
		.data(branches)
		.enter()
		.append('line')
		.attr('x1', x1)
		.attr('y1', y1)
		.attr('x2', x2)
		.attr('y2', y2)
		.style('stroke-width', function(d) {
        var t = parseInt(levels*length + 1 - d.d*length);
        return  t + 'px';
		})
		.style('stroke', function(d){
			if (d.d < 3){
				return colorTrunk(d.d);
			}
			else{
			return colorBranch[Math.floor(Math.random()*colorBranch.length)];
			}
		})
		.attr('id', function(d) {return 'id-'+ d.i;});
}

function draw() {
	d3.select('svg').selectAll("*").remove();
	d3.select('svg')
		.selectAll('line')
		.data(branches)
		.enter()
		.append('line')
		.attr('x1', x1)
		.attr('y1', y1)
		.attr('x2', x2)
		.attr('y2', y2)
		.style('stroke-width', function(d) {
			var t = parseInt(levels*length + 1 - d.d*length);
			return  t + 'px';
		})
		.style('stroke', function(d){
			if (d.d < 3){
				return colorTrunk[Math.floor(Math.random()*colorTrunk.length)];
			}
			else{
			return colorBranch[Math.floor(Math.random()*colorBranch.length)];
			//return randomColor(0);
			}
		})
}

function drawLeaf() {
    d3.select('svg')
        .selectAll('image')
        .data(branches)
        .enter()
        .append('svg:image')
        .attr('x', x2)
        .attr('y', y2)
        .attr("xlink:href", function(d){
            if (d.d >= 5){
                return  leaves[Math.floor(Math.random()*leaves.length)];
            }
        })
        .attr('width', function(d){
        	return Math.floor(Math.random()*10 + 8);
        })
        .attr('height', function(d){
        	return Math.floor(Math.random()*10 + 8);
        })
        .attr('class', 'leaves');
}

function generate() {

	var start = performance.now();
	branches = [];
	trunk(seed);
	draw();
	drawLeaf();
	var end = performance.now();
	document.getElementById('status').innerHTML = 'Generated in: ' + ((end - start)/1000).toFixed(3)+ ' s';
}
function update_gen(changeTree) {
	
	var start = performance.now();
	branches = [];
	trunk(seed);
	changeTree ? drawNoErase() : update();
	var end = performance.now();
	
	document.getElementById('status2').innerHTML = 'Changed parameters in: ' + ((end - start)/1000).toFixed(3)+ ' s';
}

d3.selectAll('.btn-update')
	.on('click', update_gen);

d3.selectAll('.btn-generate')
	.on('click', generate);

generate(true);
update_gen(true);
