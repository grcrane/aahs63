/* ------------------------------------------------------ */
/* AAHS 63 Class List                                     */
/* George Crane, August 2021                              */
/* ------------------------------------------------------ */

/* Usage 

jQuery(document).ready(function() {
  do_classList();   
});

writes to .gallery-container .gallery-items

<div id="classList">					
	<div class="gallery-container">
		<div class="gallery-items"></div>
	</div>
</div>

*/

var position = jQuery(window).scrollTop(); 

function get_spreadsheet(theurl) {
  var result = "";
  jQuery.ajax({
      url: theurl,
      dataType: 'text',
      async: false,
      success: function(data) {
          i = data.indexOf('(');
          j = data.lastIndexOf(')');
          data = data.substr(i + 1, j - 1 - i);
          var data = JSON.parse(data);
          result = data;
      }
  });
  return result;
}

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
        //console.log('found');
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

function do_classmates(
  file_id ="1RtXQ2sO42sW-3SInyNIjO_lUr_2pfJrWCr8xM0jNp3I", 
  sheet = "Classmates") {

  // Get the spreadsheet data
  var url = 'https://docs.google.com/spreadsheets/u/0/d/'
    + file_id + '/gviz/tq?headers=1&sheet=' + sheet 
    + '&tqx=out:json&headers=1&tq=' + 
  escape("SELECT A, B, C, D, E, I, H, J, K, L, M, N, O");
  var spreadSheetLink = 'https://docs.google.com/spreadsheets/d/' 
    + file_id + '/edit';
  var classmateList = get_spreadsheet(url);
  var temp = '<a href="' + url.replace('out:json','out:html') + '" target="_blank">url</a>';
  jQuery('#url').html(temp);
  // Test for some error conditions 
  if(classmateList.length == 0) {
      jQuery('.faq_gallery-container').append('<br>Ooops.. unable to read spreadsheet</br>');
      return;
  }
  return classmateList;
}





function do_classList() {
  var memberRows = []; 
  dataArray = do_classmates();
  var titles = []; 
  var coltitles = ["View","ID","Last Name","First Name","Middle","Married","Image"];  
  coltitles.forEach(function(item, index) {
      titles.push({title: item})
  })

  var maxItem = parseInt(jQuery("#classmateItems").val());
  
  // push data array
  var data = []; 
  memberRows = dataArray.table.rows;
  memberRows.forEach(function(item, key) { 
    var theclass = "";
    var thesrc = '';
    var thestatus = 'Unknown';
    var themarried = ''; 
    var hasprofile = 'N';
    var thetype = 'classmate';
    var id = '';
    var thepassed = ''; 
    var theobit = ''; 
    var google = ''; 
    var theimages = '';
    var needinfo = 'no';
    if (item.c[9] != null && item.c[9].v != null) { google = item.c[9].v;}
    if (item.c[8] != null && item.c[8].v != null) { hasprofile = 'Y';}
    if (item.c[4] != null && item.c[4].v != null) { themarried = item.c[4].v;}
    if (item.c[6] != null && item.c[6].v != null) { thestatus = item.c[6].v;}
    if (item.c[5] != null && item.c[5].v != null) { thetype = item.c[5].v;}
    if (item.c[7] != null && item.c[7].v != null) { thesrc = item.c[7].v;}
    if (item.c[8] != null && item.c[8].v != null) { thepassed = item.c[8].v;}
    if (item.c[9] != null && item.c[9].v != null) { theobit = item.c[9].v;}
    if (item.c[12] != null && item.c[12].v != null) { theimages = item.c[12].v;}
    if (item.c[0] != null && item.c[0].v != null) { id = item.c[0].v;}
    if (thesrc) {
      thesrc = 'https://www.grcrane2.com/aahs63_images/' +thesrc;
      //thesrc = 'https://drive.google.com/uc?export=view&id=' + google;
    }
    if (thestatus.toLowerCase() == 'passed') {
      if (thepassed.length < 5 || theobit == '') {
        needinfo = 'yes';
      }
    }
    var out = '<a class="itemLink" href="#" data-row="' + key + '" data-id="' + id + '"><div class="item" data-profile="' + hasprofile + '" data-name="' + item.c[1].v + ', ' + item.c[2].v + " " + themarried +
      '" data-type="' + thetype + '" data-status="' + thestatus.toLowerCase() + 
      '" data-href="' + thesrc + '" data-need="' + needinfo + '">\n';
    if (key > maxItem ) {thesrc = '';} 
    if (thesrc) {
      out = out + '<img class="' + theclass + '"  src="' + thesrc + '" xalt="No image" /></a>\n';
    }
    else {
      out = out + '<div class="empty"></div></a>'; 
    }
      var name = item.c[1].v + ', ' + item.c[2].v;
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

  jQuery('.itemLink').on('click', function (event) {
    event.preventDefault(); 
    var id = jQuery(this).data("id");
    var row = jQuery(this).data("row");
    var status = jQuery(this).parent().data("status");
    var name = jQuery(this).parent().find('div.caption').text();
    var imgsrc = jQuery(this).find('img').attr('src');
    jQuery('#classmateInfo header h1').text(name);
    jQuery('p.status').text('Status: ' + status);
    var needinfo = jQuery(this).parent().data("need");
  
    var obit = 'Missing'; 
    if (memberRows[row]['c'][9] != null && memberRows[row]['c'][9].v != null) {
      obit = '<a href="' + memberRows[row]['c'][9].v + '" target="_blank">' +
      memberRows[row]['c'][9].v + '</a>\n';
    }
    var death = 'Unknown';
    if (memberRows[row]['c'][10] != null && memberRows[row]['c'][10].v != null) {
      death = memberRows[row]['c'][10].v;
    }

    var img = '';
    if (memberRows[row]['c'][7] != null && memberRows[row]['c'][7].v != null) {
      img = '<img class="idPhotoImage profileImg" src="' + imgsrc + '">';

    }
    jQuery('#idImage').html(img);
    if (memberRows[row]['c'][8] != null && memberRows[row]['c'][8].v != null) {
      jQuery('.classmateContent').html(memberRows[row]['c'][8].v);
    }
    else {
        jQuery('.classmateContent').html('<p>No profile found</p>');
      } 
    jQuery('p.status').text('Status: ' + status);  
    var formurl = 'https://docs.google.com/forms/d/e/1FAIpQLSdG4w35Ip2u5-q9R7W8R5euIB4CJVqDHTrbIs8lxhx4Rq1jKA/viewform' +
      '?usp=pp_url&entry.1389452980=' + name;
    if (status == 'passed') {
      var temp = '<br>Date of death: ' + death + 
      '<br>Obituary: <span>' + obit + '</span>';
      jQuery(temp).appendTo('p.status');
    }
    temp = '<br>Help update, click <a href="' + formurl + '" target="_blank">here</a> if you have additional information.'; 
    jQuery(temp).appendTo('p.status');
    temp = '<br>the images=' + theimages;
    jQuery(temp).appendTo('p.status');
    position = jQuery(window).scrollTop(); 
    jQuery('#classmateInfo').show();
    jQuery('.gallery-container').hide(); 
    jQuery('#locateInfo').hide();   
    var elmnt = document.getElementById("page");
    elmnt.scrollIntoView(true);
    

  })

  jQuery('.backButton').on('click', function (event) {
    jQuery('#classmateInfo').hide();
    jQuery('.gallery-container').show();
    jQuery('#locateInfo').hide(); 
    jQuery(window).scrollTop(position); 
    
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

  do_search(); 
  var c = jQuery('.item.showme');

} 