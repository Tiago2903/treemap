import './bootstrap';

fetch("getCotacao").then((response) => {
	if (response) {
		return response.text()
	}
}).then((text) => {
	let cotacao = [];
	cotacao.push(JSON.parse(text));

	const dadosConvertidos = convertData(cotacao);
	if (dadosConvertidos) {
		let height = 1000,
			width = 700,
			legend = 100;

		let svg = d3.select("#tree").attr("width", width).attr("height", height);
		const color = d3.scaleOrdinal(d3.schemeSet3)
		let hierarchy = d3.hierarchy(dadosConvertidos).sum(d => d.valor);
		let treemap = d3.treemap().size([width, height - legend]).paddingInner(5)(hierarchy);

		let childArray = treemap.descendants().filter(d => d.depth == 2);
		let parentArray = treemap.descendants().filter(d => d.depth == 1);
		let matchParent = (category) => {
			return parentArray.findIndex(x => x.data.moeda == category)
		}

		let tool = d3.select("body").append("div").attr("class", "toolTip");

		let cells = svg.selectAll(".cells")
			.data(childArray)
			.enter()
			.append('rect')
			.attr('x', d => d.x0)
			.attr('y', d => d.y0)
			.attr('width', d => (d.x1 - d.x0))
			.attr('height', d => (d.y1 - d.y0))
			.style('stroke', "white")
			.style("fill", d => color(matchParent(d.parent.data.moeda)));

		cells.on("mousemove", function (d) {
			let html = `${d.originalTarget.__data__.data.moeda} <br>1 USD compram: ${d.originalTarget.__data__.data.codigo} ${d.originalTarget.__data__.data.valor.toFixed(2).replace('.', ',')}`
			tool.style("left", event.pageX + 10 + "px")
			tool.style("top", event.pageY - 20 + "px")
			tool.style("display", "inline-block");
			tool.html(html);
		}).on("mouseout", function (d) {
			tool.style("display", "none");
		});

		svg.selectAll('text')
			.data(childArray)
			.enter()
			.append('text')
			.attr('x', d => (d.x0 + (d.x1 - d.x0) / 2))
			.attr('y', d => (d.y0 + (d.y1 - d.y0) / 2))
			.attr("text-anchor", "middle")
			.attr("fill", "black")
			.text(d => d.data.codigo);

		let gBottom = svg.append('g').attr('transform', `translate(50,${height - legend / 2})`);
		let xLegend = -120;

		gBottom.selectAll("#legend")
			.data(parentArray)
			.enter()
			.append('rect')
			.attr("x", () => xLegend += 150)
			.attr("y", 0)
			.attr("width", 15)
			.attr("height", 15)
			.style("stroke", "white")
			.style("fill", d => color(matchParent(d.data.moeda)));

		xLegend = -90;

		gBottom.selectAll("text")
			.data(parentArray)
			.enter()
			.append('text')
			.attr("x", () => xLegend += 150)
			.attr("y", 12.5)
			.attr("text-anchor", "start")
			.attr("fill", "black")
			.attr("font-size", "10px")
			.style("class", "atext")
			.text(d => d.data.name);
	}
})

function convertData(dados) {
	const currencies = Object.values(dados[0]);
	const children = currencies.map(currency => ({
		"moeda": currency.moeda,
		"codigo": currency.codigo,
		"valor": parseFloat(currency.valor)
	}));

	return {
		"name": "Cotacao",
		"children": [
			{
				"name": "Fiat",
				"children": children
			}
		]
	};
};