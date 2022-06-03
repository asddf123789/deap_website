import { colors } from './color.js';
import { genes } from './genes.js';
import { motifs } from './motifs.js';

function calculateAverage(params) {
    var sum = 0;
    var count = 0;
    for (var i=0; i<params.length; i++) {
        //if (params[i] !== 0) {
            sum = sum + Number(params[i]);
            count++;
       // }
    }
    return sum / count;
}

export default class Plot {
  plot;
  plot_id;
  bar_plot;
  bar_plot_id;
  timepoint_selector;
  annotation_selector;
  groupby_selector;
  gene_selector;
  legend_toggle;
  detail = "annotation";
  traces = [];
  colors = {};
  bar_data = {};
  legendVisible = true;

  constructor(plot_id, timepoint_id, annotation_id, gene_id, gene_w_id, legend_id, loading_id, apply_id, title_id, assay, bar_plot_id,bar_loading_id, bar_apply_id, groupby_id, groupby_wrapper, apply_wrapper) {
    this.plot_id = plot_id;
    this.bar_plot_id = bar_plot_id;
    this.timepoint_selector = document.getElementById(timepoint_id);
    this.annotation_selector = document.getElementById(annotation_id);
    this.groupby_selector = document.getElementById(groupby_id);
    this.gene_selector = document.getElementById(gene_id);
    this.gene_wrapper = document.getElementById(gene_w_id);
    this.groupby_wrapper = document.getElementById(groupby_wrapper);
    this.apply_wrapper = document.getElementById(apply_wrapper);
    this.legend_toggle = document.getElementById(legend_id);
    this.colors = colors;
    this.loading_div = document.getElementById(loading_id);
    this.bar_loading_div = document.getElementById(bar_loading_id);
    this.apply = document.getElementById(apply_id);
    this.bar_apply = document.getElementById(bar_apply_id);
    this.title = document.getElementById(title_id);
    this.assay = assay;
    this.bar_layout = { yaxis: { title: 'Counts' } };
    console.log('finished construction');
  }

  get plot_id() {
    return this.plot_id;
  }

  get plot() {
    return this.plot;
  }

  get bar_plot_id() {
    return this.bar_plot_id;
  }

  get bar_plot() {
    return this.bar_plot;
  }
  
  async create_plot() {
    this.#update_title();
    console.log('creating plot');
    let traces = await this.#generate_traces();
    let datas = await this.#generate_bar_data();
    console.log('done generating traces')
    let layout = {
      scene: {
        xaxis: {
          // visible: false
          showticklabels: false,
          title: { text: "UMAP 1" }
        },
        yaxis: {
          // visible: false
          showticklabels: false,
          title: { text: "UMAP 2" }
        }
      },
      height: 450,
      margin: { l: 0, r: 0, b: 0, t: 0 },
      legend: { bgcolor: 'rgba(255,255,255,0.6)', yanchor: "top", y: 0.95, xanchor: "right", x: 0.99 },
      showlegend: this.legendVisible
    };

    await Plotly.newPlot(this.plot_id, traces, layout, { responsive: true })
    this.#update_bar_layout();
    await Plotly.newPlot(this.bar_plot_id, [datas], this.bar_layout)
    this.loading_div.classList.remove('lds-ellipsis');
    this.bar_loading_div.classList.remove('lds-ellipsis');
    this.plot = document.getElementById(this.plot_id);
    this.bar_plot = document.getElementById(this.bar_plot_id);
    this.#add_listeners();
  }

  async update_plot(update_all=true) {
    if (update_all) {
      console.log('updating');
      let old_traces_length = this.traces.length;
      try {
        await this.#generate_traces();
        await this.#generate_bar_data();
      } catch (err) {
        document.getElementById("error-message").innerHTML = err;
        return;
      }
      Plotly.deleteTraces(this.plot_id, [...Array(old_traces_length).keys()]);
      this.#update_title();
      Plotly.addTraces(this.plot_id, [...this.traces]);
      this.#update_bar_layout();
      Plotly.react(this.bar_plot_id, [this.bar_data], this.bar_layout);
      this.loading_div.classList.remove('lds-ellipsis');
      this.bar_loading_div.classList.remove('lds-ellipsis');
    } else {
      try {
        await this.#generate_bar_data();
      } catch (err) {
        document.getElementById("error-message").innerHTML = err;
        return;
      }
      this.#update_bar_layout();
      Plotly.react(this.bar_plot_id, [this.bar_data], this.bar_layout);
      this.bar_loading_div.classList.remove('lds-ellipsis');
    }
  }

  async #generate_traces() {
    this.loading_div.classList.add('lds-ellipsis');
    let data;
    try {
      data = await this.#fetch_data();
    } catch (err) {
      this.loading_div.classList.remove('lds-ellipsis');
      throw err
    }
    let filtered_data = [];
    let traces = [];
    let annotation = this.annotation_selector.value;
    let unique = [];
    let color = [];

    if (this.detail == "gene") {
      unique = ['expression'];
    } else if (annotation == 'inferred_time') {
      unique = ['inferred_time'];
    } else {
      unique = [...new Set(this.#unpack(data, annotation))];
    }

    for (let item in unique) {
      if (annotation != 'inferred_time' & this.detail != 'gene') {
        filtered_data = data.filter((el) => el[annotation] == unique[item]);
        color = this.colors[unique[item]];
      } else {
        filtered_data = data;
        color = this.#unpack(filtered_data, unique[item]);
      }

      let trace = {
        name: unique[item],
        x: this.#unpack(filtered_data, 'UMAP_1'), y: this.#unpack(filtered_data, 'UMAP_2'),
        mode: 'markers',
        marker: {
          size: 3,
          color: color,
          width: 0.1,
          showscale: this.detail == "gene" || annotation == 'inferred_time'
        },
        type: 'scattergl',
        hovertemplate: "Trace",
      };
      traces.push(trace);
    }
    this.traces = traces;
    return traces;
  }
  
  async #generate_bar_data() { //TODO:merge with generate_traces
    this.bar_loading_div.classList.add('lds-ellipsis');
    let data;
    try {
      data = await this.#fetch_data();
    } catch (err) {
      this.bar_loading_div.classList.remove('lds-ellipsis');
      throw err
    }
    let filtered_data = [];
    let bar_x = [];
    let bar_y = [];
    let annotation = this.annotation_selector.value;
    let groupby = this.groupby_selector.value;
    let unique = [];
    let color = [];

    if (this.detail == "gene") {
      unique = ['expression'];
    } else if (annotation == 'inferred_time') {
      unique = ['inferred_time'];
    } else {
      unique = [...new Set(this.#unpack(data, annotation))];
    }

    for (let item in unique) {
      if (annotation != 'inferred_time' & this.detail != 'gene') {
        filtered_data = data.filter((el) => el[annotation] == unique[item]);
        color = this.colors[unique[item]];
        bar_x.push(unique[item]); 
        bar_y.push(filtered_data.length);
      } else {
        filtered_data = data;
        color = this.#unpack(filtered_data, unique[item]);
        let groupby_data;
        try {
          groupby_data = await this.#fetch_bar_data();
        } catch (err) {
          this.bar_loading_div.classList.remove('lds-ellipsis');
          throw err
        }
        let groupby_array = this.#unpack(groupby_data, groupby)
        var map = new Map();
        for (var i=0; i < groupby_array.length; i++) {
            var key = groupby_array[i];
            var value = color[i];
            if(!map.has(key)){
              map.set(key, [value]);
            } else {
              var old = map.get(key);
              old.push(value);
            }
        }
        map.forEach((values,keys) => {
          var avg = calculateAverage(values);
          bar_x.push(keys); 
          bar_y.push(avg);
          console.log("keys: " + keys + " avg: " + avg);
        })
      }
    }
    
    this.bar_data = {x:bar_x, y:bar_y, type: 'bar'};
    return {x:bar_x, y:bar_y, type: 'bar'};
  }

  async #fetch_data() {
    if (this.detail == 'gene' & (!this.gene_selector.value || !genes.includes(this.gene_selector.value)) & this.assay=='RNA') {
      throw "Please Select a Gene"
    }
    if (this.detail == 'gene' & (!this.gene_selector.value || !motifs.includes(this.gene_selector.value)) & this.assay=='ATAC') {
      throw "Please Select a Motif"
    }
    let params = {
      "timepoint": this.timepoint_selector.value,
      "annotation": this.annotation_selector.value,
      "gene": this.detail == 'gene' ? this.gene_selector.value : '',
      "assay": this.assay
    }

    console.log('fetching data');
    const res = await fetch('/deap_v2/data?' + new URLSearchParams(params));
    if (!res.ok) {
      throw "Database Error"
    }
    return res.json();
  }
  
  async #fetch_bar_data() {
    let params = {
      "timepoint": this.timepoint_selector.value,
      "annotation": this.groupby_selector.value,
      "gene": '',
      "assay": this.assay
    }

    console.log('fetching data');
    const res = await fetch('/deap_v2/data?' + new URLSearchParams(params));
    if (!res.ok) {
      throw "Database Error"
    }
    return res.json();
  }

  #add_listeners() {
    this.annotation_selector.onchange = () => {
      if (this.annotation_selector.value.includes('gene_expression')) {
        $(this.gene_wrapper).removeClass('hide')
        $(this.gene_wrapper).addClass('slide-right')
        this.detail = "gene"
        $(this.apply).addClass("button-primary");
        $(this.groupby_wrapper).removeClass('hide');
        $(this.apply_wrapper).removeClass('hide');
      } else {
        this.detail = "annotation";
        $(this.gene_wrapper).addClass('hide')
        $(this.gene_wrapper).removeClass('slide-right')
        $(this.apply).addClass("button-primary");
        $(this.groupby_wrapper).addClass('hide');
        $(this.apply_wrapper).addClass('hide');
      };
      if (this.annotation_selector.value == 'inferred_time') {
        $(this.groupby_wrapper).removeClass('hide');
        $(this.apply_wrapper).removeClass('hide');
      }
    };
      
    this.groupby_selector.onchange = () => {
      $(this.bar_apply).addClass("button-primary");
    };

    this.gene_selector.oninput = () => this.#generate_genes_field_autocomplete();

    this.legend_toggle.addEventListener('click', () => {
      Plotly.relayout(this.plot_id, { 'showlegend': !this.legendVisible })
      this.legendVisible = !this.legendVisible;
      $(this.legend_toggle).toggleClass("button-primary");
    });

    this.apply.addEventListener('click', () => {
      document.getElementById("error-message").innerHTML = "";
      this.update_plot();
      $(this.apply).removeClass("button-primary");
    });
    
    this.bar_apply.addEventListener('click', () => {
      document.getElementById("error-message").innerHTML = "";
      this.update_plot(false);
      $(this.bar_apply).removeClass("button-primary");
    });
  }

  #generate_genes_field_autocomplete() {
    this.#closeAllGeneLists();
    let text = this.gene_selector.value;

    let gene_list = document.createElement('div');
    gene_list.setAttribute('class', 'autocomplete-list');
    this.gene_selector.parentNode.parentNode.insertBefore(gene_list, this.gene_selector.parentNode.nextSibling);
    if (this.assay == 'RNA') {
    for (const gene of genes) {
      if (gene.toLowerCase().includes(text.toLowerCase()) && text) {
        let matching_gene = document.createElement('div');
        matching_gene.innerHTML = gene;
        matching_gene.addEventListener('click', () => {
          this.gene_selector.value = gene;
          this.#closeAllGeneLists();
          this.detail = "gene";
          $(this.apply).addClass("button-primary");
        });
        gene_list.appendChild(matching_gene);
      }
    }}
    if (this.assay == 'ATAC') {
    for (const motif of motifs) {
      if (motif.toLowerCase().includes(text.toLowerCase()) && text) {
        let matching_gene = document.createElement('div');
        matching_gene.innerHTML = motif;
        matching_gene.addEventListener('click', () => {
          this.gene_selector.value = motif;
          this.#closeAllGeneLists();
          this.detail = "gene";
          $(this.apply).addClass("button-primary");
        });
        gene_list.appendChild(matching_gene);
      }
    }}
    if (!gene_list.hasChildNodes()) {
      this.#closeAllGeneLists();
    }
  }

  #closeAllGeneLists() {
    const gene_lists = document.getElementsByClassName('autocomplete-list');
    for (const list of gene_lists) {
      list.parentNode.removeChild(list);
    }
  }

  #update_title() {
    let colored_by
    if (this.detail == 'gene') {
      if (this.assay == 'RNA') {
        colored_by = `${this.gene_selector.value} gene expression`
      } else {
        colored_by = `${this.gene_selector.value} motif activity`
      }
    } else {
      colored_by = `${this.annotation_selector.value.replace('_', ' ')}`
    }
    this.title.innerHTML = `sc${this.assay} cells in ${this.timepoint_selector.value} colored by ${colored_by}`
  }

  #update_bar_layout() {
    let yaxis_text = 'Counts'
    if (this.detail == 'gene') {
      if (this.assay == 'RNA') {
        yaxis_text = `Mean of ${this.gene_selector.value} gene expression`
      } else {
        yaxis_text = `Mean of ${this.gene_selector.value} motif activity z-scores`
      }
    } else if (this.annotation_selector.value == 'inferred_time') {
      yaxis_text = `Mean of inferred time`
    }
    this.bar_layout = { yaxis: { title: yaxis_text } };
  }
  
  #unpack(data, key) { return data.map(row => row[key]) }
}
