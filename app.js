const path = require('path');
const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();

const hostname = '127.0.0.1';
const port = 4000;
const { __db_path__ } = require('./public/js/global.js')

app.use('/deap/public', express.static(path.join(__dirname, '/public')));

console.log(__dirname);

const db = new sqlite3.Database(__db_path__, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.log('Failed connection to database');
    console.error(err);
  } else {
    console.log('Established connection to database');
  }
});

app.get('/deap', (_, res) => {
  res.sendFile(path.join(__dirname, 'public/about.html'))
});

app.get('/deap/data', (req, res) => {
  try {
    process_data_request(req.query, res);
    console.log('Processing request..');
  } catch (err) {
    console.error(err);
  }
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/deap`);
});

process_data_request = (params, res) => {
  let sql = '';
  if (params.gene) {
    sql = `select c.UMAP_1, c.UMAP_2, ifnull(g.value, 0) as expression
            from ${params.assay}_cell_meta c
            left join (
                select key, value 
                from (
                    select value as v 
                    from ${params.assay}_gene, json_each(json(data))
                    where timepoint = '${params.timepoint}' 
                        and gene = '${params.gene}'
                ) j, json_each(j.v)
            ) g on g.key = c.cell
            where c.inferred_time_window = '${params.timepoint}'`
  } else if (params.annotation) {
    sql = `SELECT C.UMAP_1, C.UMAP_2, C.${params.annotation}
              FROM ${params.assay}_cell_meta C
              WHERE C.inferred_time_window = '${params.timepoint}'`
  } else {
    return res.status(500).json({ 'error': `Invalid query parameters ${JSON.stringify(params)}` });
  }

  console.log(sql);
  db.all(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ 'error': `Database encountered an error: ${err}` });
    }
    return res.json(rows);
  });
}
