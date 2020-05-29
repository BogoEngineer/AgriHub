import { Component, OnInit} from '@angular/core';
import { CompanyService } from '../../services/company.service';
import * as d3 from 'd3';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-order-chart',
  templateUrl: './order-chart.component.html',
  styleUrls: ['./order-chart.component.css']
})
export class OrderChartComponent implements OnInit {
  data: number[];
  constructor(private companyService: CompanyService) { }

  ngOnInit(): void {
    this.companyService.getData().subscribe(res => {
      this.data = res.data;
      console.log(this.data);
      this.drawChart();
    });
  }

  drawChart() {
    let data = this.data;
    let bar_space = 0.3;
    let bar_width = 3;
    let height = 500;

    let info = d3.select('body').append('p')
      .style('position','absolute')
      .style('font-size', '15px')
      .style('opacity',0)


    let y_scale = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([0.01*height, 0.95*height]);

    var chart = d3.select('#chart').append('svg')
      .attr('width', '90%')
      .attr('height', '95%')
      .style('background', 'silver')
      .style('position', 'relative')
      .style('left', '5%')
      .style('top', '5%')
      .style('stroke', 'white')
      .style('stroke-width', '3px')
      .selectAll('rect')
      .data(data)
      .enter()
        .append('rect')
        .style('fill', 'rgb(24, 124, 238)')
        .style('stroke', 'black')
        .style('stroke-width', '1px')
        .style('opacity', 0.6)
        .attr('width', bar_width+'%')
        .attr('height', function (data) {
          return y_scale(data);
        })
        .attr('x', 0)
        .attr('y', height)
        .attr('rx', '0.5%')
        .attr('ry', '0.5%')
  .on('mouseover', function(data, index){
    info.transition()
      .style('opacity', 1)
    
    info.html(data.toString() + " order(s)" + ", " + (30-index).toString() + " days ago")
      .style('left', index/30*100-index*bar_space +'%')
      .style('top', '94%')
    
    d3.select(this).style('opacity', 1)

  })
  .on('mouseout', function(data){
    info.transition()
      .style('opacity', 0)
    
      d3.select(this).style('opacity', 0.6);
  })

  chart.transition()
    .attr('y', function(d){
      return height - y_scale(d);
    })
    .attr('x', function(data, index){
      return index*(bar_width+bar_space)+'%'
    })
    .duration(1000)
    .delay(300)
  }
}