/* ------------------------------------------------------ */
/* AAHS 63 Class List                                     */
/* George Crane, August 2021                              */
/* ------------------------------------------------------ */

function formatURL(file_id, sheet, query) {
  var d = new Date();
  var n = d.getTime(); 
  var temp = 'https://docs.google.com/spreadsheets/u/0/d/'
  + file_id + '/gviz/tq?headers=1&sheet=' + sheet 
  + '&t=' + n 
  + '&tqx=out:json&headers=1&tq=' + 
  escape(query);
  //alert(temp);
  return temp; 
}

var image_file_id = '1EDNx6F1ywhoEsnNS2DSSyBkgNphoQEnmccFS3gOZ5PU';
var image_sheet = 'Allimages';
var imagequery = "SELECT A, B, C, D";
var imagessurl = formatURL(image_file_id, image_sheet, imagequery);
jQuery('<div id="markTime"></div>').appendTo("p#found");
jQuery('<div id="loading"></div>').insertBefore("div.gallery-items");

/* ----------------------------------------------------------- */
/* Initialize variables                                        */
/* ----------------------------------------------------------- */  

//Copy of Master List Public View (aahsclassof63@gmail.com)
var classmatefile_id ="1iF4ZFThYH6qRH9TyoEdxRDjVUplg8LIyolDlkbJbUzY";
var classmatesheet = "Sheet1";
var query = "";
var classmatesurl = formatURL(classmatefile_id, classmatesheet, query);

var imageArray = [];
var imageData = [];
var imageNumberXRef = []; 

var windowposition = 0; 

/* ----------------------------------------------------------- */
/* Fetch one or more URL's from Google                         */
/* ----------------------------------------------------------- */  

async function fetchGoogleDataAll(urls) {
  let promises = [];
  //urls[1] = 'xx'; // to test errors
  var status = ''; 
  urls.map(x => promises.push(
    fetch(x)
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response;
        } else {
          status = response.statusText;
        }
      })
      .catch((error) => {
        status = error;
      })
  ));
  const promisResponse = await Promise.all(promises);
  var data3 = []; 
  if (!status) {
    for (let i = 0; i < promisResponse.length; i++){
      var temp = await promisResponse[i].text();
      data3.push(JSON.parse(temp.substr(47).slice(0, -2)));
    }
  }
  return [data3,status];
}


var position = jQuery(window).scrollTop(); 

function do_page(page = 1) {
  var maxItem = parseInt(jQuery("#classmateItems").val());

  var start = (page - 1) * maxItem;
  var stop = start + maxItem; 
  jQuery('.item.filtered').removeClass('filtered');
  var galleryItems = jQuery('.item.showme');
  galleryItems.each(function(index) {
    if (parseInt(index) >= start && parseInt(index) < stop) {
      var src = jQuery(this).data('href');
      var temp = jQuery(this).find('a img');
      if (temp.length) {
      }
      else {
        if (src) {
          var tempsrc = '<img class="mateImage" src="' + src + '">';
          jQuery(this).find('a.itemLink').html(tempsrc);}
      }
      jQuery(this).addClass('filtered');  
    }   
  })
}

function do_search() {
  var thevalue = jQuery('#search').val();
  var classmateType = jQuery("#classmateType").val();
  var classmateStatus = jQuery("#classmateStatus").val();
  var maxItem = parseInt(jQuery("#classmateItems").val());
  thevalue = thevalue.trim(); 
  jQuery('div.item').removeClass('showme');
  if (!thevalue && !classmateType && !classmateStatus) {
    jQuery('[data-name]').addClass('showme');
    
  }
  else {
    var str = '';
    var aval = thevalue.split(" ");
    aval.forEach(function(item,index) {
      if (item) {
        str = str + '[data-name*="' + item + '" i]';
      }
    })
    if (classmateType) {
      str = str + '[data-type="' + classmateType + '" i]';
    }
    if (classmateStatus && classmateStatus != 'profile' && classmateStatus != 'need') {
      str = str + '[data-status="' + classmateStatus + '" i]';
    }
    if (classmateStatus && classmateStatus == 'profile') {
      str = str + '[data-profile="Y"]';
    }
    if (classmateStatus && classmateStatus == 'need') {
      str = str + '[data-need="yes"]';
    }
    var good_to_go = jQuery(str).addClass('showme');

  }

  var c = jQuery('.item.showme');
  var f = jQuery('.item');
  jQuery('#found span.count').text('Found: ' + c.length);
  
  if (c.length != f.length) { 
    jQuery('#resetValues').addClass('show');
  } else {
    jQuery('#resetValues').removeClass('show');
  }
  var container = jQuery('.light-pagination');
  container.pagination({
      items: c.length,
      itemsOnPage: maxItem,
      cssStyle: 'light-theme',
      showNavigator: true,
      position: 'top',
      formatNavigator: '<span style="color: #f00"><%= currentPage %></span> st/rd/th, <%= totalPage %> pages, <%= totalNumber %> entries',
      onInit: function () {
            // fire first page loading
        },
      onPageClick: function (page, evt) {           
            do_page(page);
        }
    
  });

  do_page(); 
}

function do_reset() {
  jQuery('#classmateType').val('');
  jQuery('#classmateStatus').val('');
  jQuery('#classmateItems').val('20');
  jQuery('#search').val('');
}

/* ----------------------------------------------------------- */
/* Open modal window for calassmate details                    */
/* ----------------------------------------------------------- */  

function addMyModal () {
  var myModalID = jQuery('#myModal');
  var myModal = `<!-- The Modal -->
  <div id="myModal" class="modal">

    <!-- Modal content -->
    <div class="modal-content">
      <span class="close">Close</span>
      <div class="theModalContent"></div>
         <header class="entry-header">
            <h1 class="entry-title classmateTitle">Brayl, Jim<sup>**</sup></h1>
         </header>
         <div class="idImage" style="float:left;margin-right: 10px;">
            <img alt="" title="Brayl, Jim" class="idPhotoImage" src="">
         </div>
         <div class="classmateContent">
            classmate content
         </div>
         <div style="clear:both;"></div>
         <p class="status"></p>
         <span class="bottomClose">Close</span>
      </div>

   </div>`;
   if (myModalID.length == 0) {
    jQuery('section#primary').append(myModal);
   }
}

function do_classList() {
  var memberRows = []; 

  myTimer1 = setTimeout(function(){ jQuery('div#loading').show(); }, 2000);
  var imagesurl = formatURL(image_file_id, image_sheet, "");
  fetchGoogleDataAll([classmatesurl,imagesurl]).then(dataArrayx => {
    if (dataArrayx[1]) {  // if there was a status error of some kind
      clearTimeout(myTimer1);
      jQuery('div#loading').hide();
      jQuery('#classList .gallery-items')
        .html('<div class="errorMessage">Error fetching spreadsheet, status= ' + dataArrayx[1] + ' try refreshing page</div>');
      return; 
    }
    dataArray = dataArrayx[0][0].table.rows;
    imageData = dataArrayx[0][1].table.rows;

    clearTimeout(myTimer1);
    jQuery('div#loading').hide(); 

    var maxItem = parseInt(jQuery("#classmateItems").val());

    dataArray.forEach(function(item,key) {
      if (item.c[0] != null) {
        var ar = [];
        for (let i = 0; i < 16; i++) {
          var val =  (item.c[i] != null) ? item.c[i].v : '';
          ar.push(val);
        } 
        memberRows.push(ar);
      }
    });

    // Build an array of image names for quick lookup
    // for lookup

    var imageXRef = []; 
    imageData.forEach(function(item,key) {
      var xname =  (item.c[2] != null ) ? item.c[2].v : '';
      imageXRef.push(xname.toUpperCase());
    });

    // Build an array of image numbers for quick lookup
    // for lookup

    imageNumberXRef = []; 
    imageData.forEach(function(item,key) {
      var xnumber =  (item.c[0] != null ) ? item.c[0].v : '';
      imageNumberXRef.push(xnumber);
    });

    memberRows.sort( function(a, b) {
      return a[1].localeCompare(b[1])
        || a[2].localeCompare(b[2]);
    })

    memberRows.forEach(function(item, key) {
      var theclass = "";
      var needinfo = 'no';
      var id = item[0];
      var name = item[1] + ', ' + item[2];
      var themarried = item[4]; 
      var thestatus = (item[7]) ? item[7] : 'Unknown';
      var thetype = (item[8]) ? item[8] : 'classmate'; 
      var thesrc = item[9];
      var thepassed = item[15]; 
      var theobit = item[11]; 
      var google = ''; 
      //var theprofile = item[10];
      var hasprofile = (item[10]) ? 'Y' : 'N';
      var theimages = item[12]; 

      var x = imageXRef.indexOf(thesrc.toUpperCase()); 
   
      if (x > -1) {
        google = (imageData[x].c[3] != null) ? imageData[x].c[3].v : null;
      }   

      if (thesrc) {
        //thesrc = 'https://www.grcrane2.com/aahs63_images/' +thesrc;
        thesrc = 'https://drive.google.com/uc?export=view&id=' + google;
      }
      if (thestatus.toLowerCase() == 'passed') {
        if (thepassed.length < 5 || theobit == '') {
          needinfo = 'yes';
        }
      }
      var out = '<a class="itemLink" href="#" data-row="' + key + '" data-id="' + id + '"><div class="item" data-profile="' + hasprofile + '" data-name="' + name + " " + themarried +
        '" data-type="' + thetype + '" data-status="' + thestatus.toLowerCase() + 
        '" data-href="' + thesrc + '" data-need="' + needinfo +  
        '" data-images="' + theimages + '">\n';
      if (key > maxItem ) {thesrc = '';} 
      if (thesrc && google) {
        out = out + '<img class="' + theclass + '"  src="' + thesrc + '" xalt="No image" /></a>\n';
      }
      else {
        out = out + '<div class="empty"></div></a>'; 
      }
        //var name = item.c[1].v + ', ' + item.c[2].v;
        if (themarried) {name = name + " (" + themarried + ")";}
        out = out + '<div class="caption">\n' +
        name + 
        '</div>\n' +
        '</div>';
          jQuery(out).appendTo('.gallery-container .gallery-items');
    }) 

    jQuery('#search').on('keyup', function (event) {
      do_search();
    });

    do_reset();

    jQuery('#classmateType, #classmateStatus, #classmateItems').on('change',function() {
      do_search();
    })

    /* ----------------------------------------------------------- */
    /* User clicked on one of the classmates.                      */
    /* Switch to the detail block and fill in the information      */
    /* ----------------------------------------------------------- */  

    jQuery('.itemLink').on('click', function (event) {
      event.preventDefault(); 
      windowposition = jQuery(window).scrollTop(); 
      var id = jQuery(this).data("id");
      var row = jQuery(this).data("row");
     // var imgsrc = jQuery(this).find('img').attr('src');
      var imgsrc = jQuery(this).closest('div.item').data('href');
      
      
      var needinfo = jQuery(this).parent().data("need");
      jQuery('.classmateContent').text('');

      console.log(memberRows[row]);
      var profiletext = memberRows[row][10];
      var name = memberRows[row][1] + ', ' + memberRows[row][2];
      jQuery('#classmateInfo header h1').text(name);
      jQuery('.modal-content header h1').text(name);
      var status = (memberRows[row][7]) ? memberRows[row][7] : 'Unknown';
      var theimages = memberRows[row][12];
      jQuery('p.status').text('Status: ' + status);

      var obit = 'Missing'; 
      if (memberRows[row][11]) {
        obit = '<a href="' + memberRows[row][11] + '" target="_blank">' +
        memberRows[row][11] + '</a>\n';
      }
      var death = 'Unknown';
      if (memberRows[row][10]) {
        death = memberRows[row][10];
      }

      var img = '<div class="empty"></div>';
      if (imgsrc) {
        img = '<img class="idPhotoImage profileImg" src="' + imgsrc + '">';

      }
      jQuery('#idImage').html(img);
      jQuery('.idImage').html(img);

      jQuery('p.status').text('Status: ' + status);  
      var formurl = 'https://docs.google.com/forms/d/e/1FAIpQLSdG4w35Ip2u5-q9R7W8R5euIB4CJVqDHTrbIs8lxhx4Rq1jKA/viewform' +
        '?usp=pp_url&entry.1389452980=' + name;
      var temp = '';
      if (status == 'passed') {
        temp = '<br>Date of death: ' + death + 
        '<br>Obituary: <span>' + obit + '</span>';
        jQuery(temp).appendTo('p.status');
        temp = ''; 
      }
      temp = temp + '<div class="updateHelp">Help update, click <a href="' + formurl + '" target="_blank">here</a> if you have additional information.</div>'; 
      jQuery(temp).appendTo('p.status');

      jQuery('div.imageThumbBox, div.classmateVideos').remove(); 

      var temp = ''; 
     
      /* ----------------------------------------------------------- */
      /* Get the classmates profile, if it exists.                   */
      /* ----------------------------------------------------------- */
      
      if (profiletext) {
         jQuery('.classmateContent').html(profiletext);
      }
      else {
         jQuery('.classmateContent').html('<p>No profile found</p>');
      }

      /* ----------------------------------------------------------- */
      /* Get the classmates extra images                             */
      /* ----------------------------------------------------------- */
      
      if (theimages) {
        theimages = theimages.toString();
        var splitimages = theimages.split(":");
        var where = ' WHERE ';
        var sep = '';
        var temp = "<div class=\"imageThumbBox\">\n" +
          "<div class=\"imageThumbs\">\n";
        var thevideo = '';
        splitimages.forEach(function(item,key) { 
          var x = imageNumberXRef.indexOf(item);
          if (x) { 
            console.log(imageData[x]);
            var google = imageData[x].c[3].v;
            var caption =  (imageData[x].c[1] != null) ? imageData[x].c[1].v : '';
            var filename = (imageData[x].c[2] != null) ? imageData[x].c[2].v : '';
            filename = filename.toUpperCase();
            var x2 = filename.indexOf('.MP4');
            
            if (x2 > -1) {
              thevideo = '<div class="classmateVideos">';
              thevideo = thevideo + '<figure><iframe src="https://drive.google.com/file/d/' +
              google + '/preview" width="audo" height="audo" allowfullscreen allow="autoplay"></iframe>' + 
              '<figcaption><b>' + caption + '</b></figcaption></figure></div>';
            }
            else {
              var thesrc = 'https://drive.google.com/uc?export=view&id=' + google;
              temp = temp + '<a href="' + thesrc + '"><img src="' + thesrc + '"></a>';  
            }  
          }
            temp = temp;
        })
        temp = temp+ "</div></div>\n" +
          "<div style=\"clear:both;\"></div>\n" + thevideo;

          jQuery(temp).insertAfter('p.status');
        }   // if (theimages)
        
        //jQuery('#myModal .classmateTitle').focus();

        
        console.log('scrollTop=' + document.querySelector("#myModal .modal-content").scrollTop);
        
        //modal.style.display = "block";
        jQuery('#myModal').show();
        jQuery('main#main').hide();
        jQuery('html').scrollTop(0);
        delete(memberRows);  // all done with this variable
    })

    /* ----------------------------------------------------------- */
    /* Set up the buttons                                          */
    /* ----------------------------------------------------------- */

    jQuery('.backButton').on('click', function (event) {
      jQuery('#classmateInfo').hide();
      jQuery('.gallery-container').show();
      jQuery('#locateInfo').hide(); 
      
      
    })

    jQuery('.helpLocate').on('click', function (event) {
      jQuery('#classmateInfo').hide();
      jQuery('.gallery-container').hide();
      jQuery('#locateInfo').show(); 
      
    })

    jQuery('#resetValues').on('click',function(event) {
      event.preventDefault(); 
      do_reset(); 
      do_search(); 
      do_page(); 
    })

    addMyModal(); 

    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    var span2 = document.getElementsByClassName("bottomClose")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function(e) {
      e.preventDefault();
      modal.style.display = "none";
      jQuery('main#main').show();
      jQuery(window).scrollTop(windowposition); 
    }
    span2.onclick = function(e) {
      e.preventDefault();
      modal.style.display = "none";
      jQuery('main#main').show();
      jQuery(window).scrollTop(windowposition); 
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
        jQuery('main#main').show();
        jQuery(window).scrollTop(windowposition); 
      }
    } 

    var urlid = getSearchParams("id");
    if (urlid) {
      jQuery('div.item a').filter('[data-id="' + urlid + '"]').trigger('click');
    }

    jQuery('#passedList a').on('click', function(event) {
      event.preventDefault();
      var urlid = jQuery(this).data('id');
      jQuery('div.item a').filter('[data-id="' + urlid + '"]').trigger('click');

    });


    /* ----------------------------------------------------------- */
    /* All set now, clear search and show the class list           */
    /* ----------------------------------------------------------- */

    do_search(); 
    var c = jQuery('.item.showme');
  }).catch(error => {
    alert('Errors encountered: ' + error);
  });
}