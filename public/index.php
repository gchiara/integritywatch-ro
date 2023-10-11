<html lang="en">
<head>
  <?php include 'gtag.php' ?>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Integrity Watch Romania</title>
  <meta property="og:url" content="https://integritywatch.ro" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Integrity Watch Romania" />
  <meta property="og:description" content="Integrity Watch Romania" />
  <meta property="og:image" content="https://integritywatch.ro/images/thumbnail.jpg" />
  <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
  <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500,700,800" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,800" rel="stylesheet">
  <link rel="stylesheet" href="fonts/oswald.css">
  <link rel="stylesheet" href="static/meetings.css?v=1">
</head>
<body>
    <div id="app" class="meetings-page">   
      <?php include 'header.php' ?>
      <!-- TOP AREA -->
      <div class="container-fluid top-description-container" v-if="showInfo">
        <div class="row">
          <div class="col-md-12 top-description-content">
            <div class="top-description-text">
              <h1>INTEGRITY WATCH ROMANIA | Întâlniri cu caracter de lobby</h1>
              <h2>Aceasta este o platformă user-friendly care oferă o perspectivă unică asupra întâlnirilor cu caracter de lobby.</h2>
              <a class="read-more-btn" href="./about.php?section=4">Citește mai mult</a>
              <button class="social-share-btn twitter-btn" @click="share('twitter')"><img src="./images/twitter-nobg.png" />Distribuiți pe Twitter</button>
              <button class="social-share-btn  facebook-btn" @click="share('facebook')"><img src="./images/facebook-nobg.png" />Distribuiți pe Facebook</button>
              <p>Click pe grafice sau pe lista/listele de mai jos pentru a sorta, filtra și clasa întâlnirile.</p>
            </div>
            <i class="material-icons close-btn" @click="showInfo = false">close</i>
          </div>
        </div>
      </div>
      <!-- MAIN -->
      <div class="container-fluid dashboard-container-outer">
        <div class="row dashboard-container">
          <!-- CHARTS - FIRST ROW -->
          <!--
          <div class="col-md-6 chart-col">
            <div class="boxed-container chart-container organizations_2">
              <chart-header :title="charts.activity.title" :info="charts.activity.info" ></chart-header>
              <div class="chart-inner" id="activity_chart"></div>
            </div>
          </div>
          <div class="col-md-6 chart-col">
            <div class="boxed-container chart-container organizations_3">
              <chart-header :title="charts.fieldsOfInterest.title" :info="charts.fieldsOfInterest.info" ></chart-header>
              <div class="chart-inner" id="foi_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container organizations_1">
              <chart-header :title="charts.legalForm.title" :info="charts.legalForm.info" ></chart-header>
              <div class="chart-inner" id="legalform_chart"></div>
            </div>
          </div>
          <div class="col-md-9 chart-col">
            <div class="boxed-container chart-container organizations_3">
              <chart-header :title="charts.financialExpense.title" :info="charts.financialExpense.info" ></chart-header>
              <div class="chart-inner" id="financialexpense_chart"></div>
            </div>
          </div>
          -->
          <!-- CHARTS - FIRST ROW - LEFT -->
          <div class="col-md-4 chart-subrow">
            <div class="row chart-subrow-row">
              <div class="col-md-12 chart-col">
                <div class="boxed-container chart-container meetings_1">
                  <chart-header :title="charts.mandateSelector.title" :info="charts.mandateSelector.info" ></chart-header>
                  <div class="mandate-selector-container">
                    <select id="mandateSelector" v-model="selectedMandate">
                      <option value="all" selected="selected">All</option>
                      <option value="Government Marcel Ciolacu">Guvernul Marcel Ciolacu</option>
                      <option value="Government Nicolae Ciucă">Government Nicolae Ciucă</option>
                      <option value="Government Florin Cîțu">Government Florin Cîțu</option>
                      <option value="Government Ludovic Orban II">Government Ludovic Orban II</option>
                      <option value="Government Ludovic Orban I">Government Ludovic Orban I</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-md-12 chart-col">
                <div class="boxed-container chart-container meetings_2">
                  <chart-header :title="charts.institution.title" :info="charts.institution.info" ></chart-header>
                  <div class="chart-inner" id="institution_chart"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- CHARTS - FIRST ROW - RIGHT -->
          <div class="col-md-8 chart-subrow">
            <div class="row chart-subrow-row">
              <div class="col-md-4 chart-col">
                <div class="boxed-container chart-container meetings_3">
                  <chart-header :title="charts.institutionCategory.title" :info="charts.institutionCategory.info" ></chart-header>
                  <div class="chart-inner" id="institutioncategory_chart"></div>
                </div>
              </div>
              <div class="col-md-4 chart-col">
                <div class="boxed-container chart-container meetings_3">
                  <chart-header :title="charts.topOfficials.title" :info="charts.topOfficials.info" ></chart-header>
                  <div class="chart-inner" id="topofficials_chart"></div>
                </div>
              </div>
              <div class="col-md-4 chart-col">
                <div class="boxed-container chart-container meetings_4">
                  <chart-header :title="charts.role.title" :info="charts.role.info" ></chart-header>
                  <div class="chart-inner" id="role_chart"></div>
                </div>
              </div>
              <div class="col-md-12 chart-col" id="wordcloud_chart_col">
                <div class="boxed-container chart-container meetings_5">
                  <chart-header :title="charts.subjects.title" :info="charts.subjects.info" ></chart-header>
                  <div class="chart-inner chart-cloud" id="subjects_chart"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- TABLE -->
          <div class="col-12 chart-col">
            <div class="boxed-container chart-container chart-container-table">
              <chart-header :title="charts.table.title" :info="charts.table.info" ></chart-header>
              <div class="chart-inner chart-table">
                <table class="table table-hover dc-data-table" id="dc-data-table">
                  <thead>
                    <tr class="header">
                      <th class="header">Număr</th> 
                      <th class="header">Demnitar</th> 
                      <th class="header">Funcție</th> 
                      <th class="header">Instituție</th>
                      <th class="header">Titlu</th> 
                      <th class="header">Începutul întâlnirii</th> 
                      <th class="header">Finalul întâlnirii</th> 
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Bottom bar -->
      <div class="container-fluid footer-bar">
        <div class="row">
          <div class="footer-col col-8 col-sm-4">
            <div class="footer-input">
              <input type="text" id="search-input" placeholder="Filtrează după titlu, subiect, demnitar sau instituție">
              <i class="material-icons">search</i>
            </div>
          </div>
          <div class="footer-col col-4 col-sm-8 footer-counts">
            <div class="dc-data-count count-box">
              <div class="filter-count">0</div>din <strong class="total-count">0</strong> întâlniri
            </div>
          </div>
        </div>
        <!-- Reset filters -->
        <button class="reset-btn"><i class="material-icons">settings_backup_restore</i><span class="reset-btn-text">Resetare filtre</span></button>
      </div>
      <!-- DETAILS MODAL -->
      <div class="modal" id="detailsModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
              <div class="modal-title">
                <div class="name">{{ selectedEl.title }}</div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="col-md-12">
                    <div class="details-line"><span class="details-line-title">Data:</span> {{ selectedEl.dateDisplay }}</div>
                    <div class="details-line"><span class="details-line-title">Demnitar:</span> {{ selectedEl.decident}}</div>
                    <div class="details-line"><span class="details-line-title">Funcție:</span> {{ selectedEl.decident_role }}</div>
                    <div class="details-line"><span class="details-line-title">Instituție:</span> {{ selectedEl.decident_institution}}</div>
                    <div class="details-line" v-if="selectedEl.topic && selectedEl.topic !== ''"><span class="details-line-title">Subiect:</span> {{ selectedEl.topic }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Loader -->
      <loader v-if="loader" :text="''" />
    </div>

    <script type="text/javascript" src="vendor/js/d3.v5.min.js"></script>
    <script type="text/javascript" src="vendor/js/d3.layout.cloud.js"></script>
    <script type="text/javascript" src="vendor/js/crossfilter.min.js"></script>
    <script type="text/javascript" src="vendor/js/dc.js"></script>
    <script type="text/javascript" src="vendor/js/dc.cloud.js"></script>

    <script src="static/meetings.js"></script>

 
</body>
</html>