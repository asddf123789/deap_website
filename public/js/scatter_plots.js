import Plot from './plot.js';

const plot1 = new Plot('scatter-plot-1', 'timepoint', 'annotation_1', 'gene_1', 'gene_wrapper_1', 'legend-1', 'loading-1', 'apply-1', 'title_1', 'RNA', 'bar-plot-1', 'loading-3','apply-3','groupby_1','groupby_wrapper_1','apply_wrapper_1');
const plot2 = new Plot('scatter-plot-2', 'timepoint', 'annotation_2', 'gene_2', 'gene_wrapper_2', 'legend-2', 'loading-2', 'apply-2', 'title_2', 'ATAC', 'bar-plot-2', 'loading-4','apply-4','groupby_2','groupby_wrapper_2','apply_wrapper_2');

Promise.all([
  plot1.create_plot(),
  plot2.create_plot()
]).then(() => {
  //window.dispatchEvent(new Event('resize'));
  //console.log('syncing cameras');
  //Plot.sync_camera(plot1, plot2);
  //Plot.sync_camera(plot2, plot1);
  document.getElementById('timepoint').onchange = () => {
    plot1.update_plot();
    plot2.update_plot();
  };
});