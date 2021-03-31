const title = d3.select("body")
              .append("text")
              .html("<div id='title'>Monthly Global Land-Surface Temperature</div><div id='description'>1753 - 2015 : in celsius \(℃\)</div>");

const w = 1000,
      h = 400,
      subH = 140,
      mainPL = 60,
      subPB = 20,
      mainP = 20,
      subW = 400;     

                
const svg = d3.select("body")
              .append("svg")
              .attr("id", "main-svg")
              .attr("width", w)
              .attr("height", h)

const subSvg = d3.select("body")
              .append("svg")
              .attr("id", "legend")
              .attr("width", w)
              .attr("height", subH)

var tooltip = d3.select("body")
                 .append("div")
                 .attr("opacity", 0)
                 .attr("id", "tooltip");


d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
  .then(dataset => {
 
  const baseTemp = dataset.baseTemperature;  
  
  const getTemp = varia => parseFloat(baseTemp + varia);
  
  const monthV = dataset.monthlyVariance;
  
  const yearMin = new Date(monthV[0].year);
  
 const yearMax = new Date(monthV[monthV.length -1].year);
  
  const minMonth = d3.min(monthV, d => d.month);
  
  const maxMonth = d3.max(monthV, d => d.month)
  
  const tempMin = d3.min(monthV, d => baseTemp + d.variance);

 const tempMax = d3.max(monthV, d => baseTemp + d.variance);
  
  const barWidth = (w - mainP - mainPL) / (yearMax - yearMin);
  
  const barHeight = (h - (mainP * 2)) / 12;
  
const colors = ["#000066" ,"#000099", "#00CCCC", "#00CC00", "#CCCC00", "#CC6600", "#CC0000"];
  
const colorVar = temperature => {
	let color = "";
	if (temperature >= 0 && temperature < 2){
	color = colors[0]; 
	} else if (temperature >= 2 && temperature < 4){
  color = colors[1] ;            
  } else if (temperature >= 4 && temperature < 6){
  color = colors[2];
  } else if (temperature >= 6 && temperature < 8){
  color = colors[3];
  } else if (temperature >= 8 && temperature < 10){
  color = colors[4];
  } else if (temperature >= 10 && temperature < 12){
  color = colors[5];
  } else {
  color = colors[6];
  }
  return color;
}

  let months = {
		1: 'Jan',
		2: 'Feb',
		3: 'Mar',
		4: 'Apr',
		5: 'May',
		6: 'Jun',
		7: 'Jul',
		8: 'Aug',
		9: 'Sep',
		10: 'Oct',
		11: 'Nov',
		12: 'Dec'
	};
  //x & yScale
  const xScale = d3.scaleTime()
                 .domain([yearMin, yearMax])
                 .range([mainPL, w - mainP]);
  
  const yScale = d3.scaleBand()
                 .domain(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"])     
                 .range([mainP, h - mainP]);  
  
  const heightSetting = mon =>{ 
    if (mon === 1){
   return mainP;
} else if (mon === 2){
   return mainP + barHeight;
} else if (mon === 3){
  return mainP + (barHeight * 2);
}  else if (mon === 4){
  return mainP + (barHeight * 3);
}  else if (mon === 5){
  return mainP + (barHeight * 4);
} else if (mon === 6){
  return mainP + (barHeight * 5);
} else if (mon === 7){
  return mainP + (barHeight * 6);
} else if (mon === 8){
  return mainP + (barHeight * 7);
} else if (mon === 9){
  return mainP + (barHeight * 8);
} else if (mon === 10){
  return mainP + (barHeight * 9);
} else if (mon === 11){
  return mainP + (barHeight * 10);
} else {
  return mainP + (barHeight * 11);
   }
 }     
 
  
  //chart 
  const chart = svg.append("g"); 
  
  chart.selectAll("rect")
      .data(monthV)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("data-month", d => d.month - 1)
      .attr("data-year", d => d.year)
      .attr("data-temp", d => baseTemp + d.variance)
      .attr("width", barWidth)
      .attr("height", barHeight)
      .attr("y", d => heightSetting(d.month))
      .attr("x", (d, i) => Math.trunc(i / 12) * barWidth + mainPL)
      
      .style("fill", d => {
    let tempColor = getTemp(d.variance);
    return colorVar(tempColor);
  })
      .on("mouseover", d => {
	tooltip.attr("data-year", d.year)
	       .attr("id", "tooltip")
	       .style("opacity", 1)
	       .style("left", (d3.event.pageX - (mainP)) + "px")
         .style("top", (d3.event.pageY - (mainP * 2)) + "px")
         .html("<div style = 'padding-bottom: 10px;'>" + months[d.month] + ",  " + d.year + "</div><div>" + (baseTemp + d.variance).toFixed(2) + "℃</div>")
})
  .on("mouseout", () => {
    tooltip.style("opacity", 0)
  })
  
  
  
 //Axis 
  const xAxis = d3.axisBottom(xScale)
  .tickFormat(d3.format("04d"))
  .ticks((yearMax - yearMin) / 10);
  
  chart.append("g")
     .attr("class", "tick")
     .attr("id", "x-axis")
     .attr("transform", "translate(0," + (h - mainP) + ")")
     .call(xAxis);

const yAxis = d3.axisLeft(yScale);
  
  chart.append("g")
     .attr("class", "tick")
     .attr("id", "y-axis")
     .attr("transform", "translate(" + mainPL + ", 0)")
     .call(yAxis);

  //legend


const thresholdTemp = [2, 4, 6, 8, 10, 12, 14];

  
const thresholdScale = d3.scaleLinear()
  .domain([0, 14])
  .range([mainPL, mainPL + subW]);
  

 const legendAxis = d3.axisBottom(thresholdScale)
  .ticks(8);

  const legendBottom = subSvg.append("g")
      .attr("transform", "translate(0," + (subH - mainPL) + ")")
     .call(legendAxis);
  
  const threshold = d3.scaleQuantile()
  .domain(thresholdTemp)
  .range(colors);

  const boxH = 40;

  const legendBox = subSvg.append("g")
      .attr("id", "legend");
  
      legendBox.selectAll("rect")
      .data(thresholdTemp)
      .enter()
      .append("rect")
      .attr("height", boxH)
      .attr("width", subW / 7)
      .attr("x", (d, i) => i * (subW / 7) + mainPL)
      .attr("y", subH - mainPL - boxH)
      .attr("class", "boxLegend")
      .style("fill", d => threshold(d))
     
  
})

