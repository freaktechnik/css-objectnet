/**
 * Analyze the relations of classes and ids in an HTML document.
 * Uses D3.js for visualization.
 */
import * as d3 from 'd3';

const LINK_LENGTH = 30,
    CHARGE = 1,
    COLLISION = 10,
    NO_RESULT = -1,
    ALPHA_START = 0.3,
    ALPHA_END = 0,
    HALF = 2;

export default class GraphData {
    constructor(size) {
        this.nodes = [];
        this.links = [];
        this.classGroup = 1;
        this.currentIDNumber = this.classGroup;
        this.color = d3.scaleOrdinal(d3.schemeCategory20);

        // setup graph

        this.svg = d3.select("svg");

        this.force = d3.forceSimulation()
            .force("link", d3.forceLink().distance(LINK_LENGTH))
            .force("charge", d3.forceManyBody().strength(CHARGE))
            .force("collision", d3.forceCollide(COLLISION));

        this.resize(size);
    }

    addClasses(elements) {
        for(const element of elements) {
            for(const c of element.classes) {
                if(this.getClassIndex(c) === NO_RESULT) {
                    this.nodes.push({
                        name: c,
                        group: this.classGroup
                    });
                }
            }
        }
    }

    getIDs(elements, group) {
        for(const element of elements) {
            if(element.id) {
                this.nodes.push({
                    name: element.id,
                    group
                });
            }
        }
    }

    generateLinks(elements, idn) {
        this.nodes.forEach((node, i) => {
            if(node.group == idn) {
                const element = elements.find((e) => e.id == node.name);
                for(const c of element.classes) {
                    const ci = this.getClassIndex(c);
                    this.links.push({
                        source: i,
                        target: ci,
                        value: 1
                    });

                    for(const sc of element.classes) {
                        if(c != sc) {
                            this.links.push({
                                source: ci,
                                target: this.getClassIndex(sc),
                                value: 0
                            });
                        }
                    }
                }
            }
        });
    }

    setElements(elements) {
        const idn = ++this.currentIDNumber,
            elementsWithId = elements.filter((e) => "id" in e);

        this.getIDs(elementsWithId, idn);
        this.addClasses(elements);
        this.generateLinks(elementsWithId, idn);

        const link = this.svg.selectAll(".link")
                .data(this.links)
                .enter()
                .append("line")
                .attr("class", "link")
                .style("stroke-width", (d) => Math.sqrt(d.value)),
            node = this.svg.selectAll(".node")
                .data(this.nodes)
                .enter()
                .append("g")
                .attr("class", "node")
                .call(d3.drag()
                    .on("start", (d) => {
                        if(!d3.event.active) {
                            this.force.alphaTarget(ALPHA_START).restart();
                        }
                        d.fx = d.x;
                        d.fy = d.y;
                    })
                    .on("drag", (d) => {
                        d.fx = d3.event.x;
                        d.fy = d3.event.y;
                    })
                    .on("end", (d) => {
                        if(!d3.event.active) {
                            this.force.alphaTarget(ALPHA_END);
                        }
                        d.fx = null;
                        d.fy = null;
                    })
                );

        node.append("text")
            .attr("dx", "2")
            .attr("dy", ".35em")
            .style("fill", (d) => this.color(d.group))
            .text((d) => (d.group == this.classGroup ? '.' : '#') + d.name);

        this.force
            .nodes(this.nodes)
            .on("tick", () => {
                link
                    .attr("x1", (d) => d.source.x)
                    .attr("y1", (d) => d.source.y)
                    .attr("x2", (d) => d.target.x)
                    .attr("y2", (d) => d.target.y);

                node.attr("transform", (d) => `translate(${d.x},${d.y})`);
            });
        this.force
            .force("link")
            .links(this.links);

        this.force.restart();
    }

    getClassIndex(className) {
        return this.nodes.findIndex((node) => node.group == this.classGroup && node.name == className);
    }

    resize({
        height, width
    }) {
        this.svg
            .attr("width", width)
            .attr("height", height);

        this.force.force("center", d3.forceCenter(width / HALF, height / HALF));
    }

    reset() {
        this.currentIDNumber = this.classGroup;
        this.nodes.length = 0;
        this.links.length = 0;

        this.svg.selectAll("*").remove();

        this.force.nodes(this.nodes);
        this.force.force("link").links(this.links);
        this.force.stop();
    }
}
