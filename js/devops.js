$(document).ready(function () {
var holder = null;
var current_page=0;
var pages=0;
var isMobile =false;

/*Function to get the page parameters if they exist  index.html?jsonId=123456798&pin=<yourpin> */
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)), sURLVariables = sPageURL.split('&'), sParameterName, i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

/*Read the .json control file json id reads a parameter to get the json control file*/
var jsonId = 'https://isdportal.oracle.com/pls/portal/tsr_admin.isd_portlets4.download_repo?p_id='+getUrlParameter('jsonId');

//the pin serves as a redirect in case the generic launchpad does not have an authenticated user.
var pin = getUrlParameter('pin');
//console.log("Parameter check json repo id is: "+jsonId+"    PIN is:  " + pin);
//console.log(jsonId);
/*Gathers information for storyboard from json control file*/
$.getJSON('js/landingpad.json', function (data) {
/*$.getJSON(jsonId, function (data) { */
        try{
        holder=data;
        pages=holder.pages.length;
        log('JSON Document Read', 'Found '+pages+' pages in the brochure.')
        //if we have more than 2 pages build our site.
        if (pages>=1) {
          if(isMobile) {
           buildpage(0);
           current_page=0; 
          }
          else {
            buildpage(0);
            buildpage(1);
            current_page=1;   
          }
        }
         //background load images
         setTimeout(function(){preload();},5000);
        // preload();
        }
        catch(err){
            log('Error building core HTML from JSON.',err.message);
        }
}).error(function() { 
//Error function is in place if the user has not authenticated.
console.log("Can not retrieve json control file redirecting for authenitcation to https://launch.oracle.com/?"+ pin);
 $(".section").append("<h1 class=\"loadingmessage\">Authorizization Token not found.<br><br>Please go to:<br><a class=\"authmessagelink\" href=\"https://launch.oracle.com/?"+pin+"\">https://launch.oracle.com/?"+pin+"</a><br> to authenticate and access content.</h1>");
 //window.location="https://launch.oracle.com/?"+pin;
});


/*This function reads the pagedesign parameter from the .json and constructs the page html dynamically.*/
function buildpage(index){
try {
    content = holder.pages[index];
               if (content.pagedesign.toLowerCase() === "instruction") {
                    $(".section").append(buildInstruction(index)).fadeIn(600);
                }
               else  if (content.pagedesign.toLowerCase() === "intro") {
                    $(".section").append(buildIntro(index,content)).fadeIn(600);
                }
               else  if (content.pagedesign.toLowerCase() === "ideation") {
                    $(".section").append(buildIdeation(index,content)).fadeIn(600);
                }
               else  if (content.pagedesign.toLowerCase() === "enabler") {
                    $(".section").append(buildEnabler(index,content)).fadeIn(600);
                }
               else  if (content.pagedesign.toLowerCase() === "ideation results") {
                    $(".section").append(buildIdeationResults(index,content)).fadeIn(600);
                }
               else  if (content.pagedesign.toLowerCase() === "enabling technologies") {
                    $(".section").append(buildEnablingTechnologies(index,content)).fadeIn(600);
                }               
               else  if (content.pagedesign.toLowerCase() === "enablement") {
                    $(".section").append(buildEnablement(index,content)).fadeIn(600);
                } 
               else  if (content.pagedesign.toLowerCase() === "leadership") {
                    $(".section").append(buildLeadership(index,content)).fadeIn(600);
                } 
                else if (content.pagedesign.toLowerCase() === "quotes") {
                    $(".section").append(buildQuotes(index,content)).fadeIn(600);
                }
                else if (content.pagedesign.toLowerCase() === "blank") {
                    $(".section").append(buildBlank(index)).fadeIn(600);
                }                
                else {
               // console.log("Add Blank page found at page number: "+index);
                $(".section").append(buildBlank(index)).fadeIn(600);
                }
        }
        catch (err) { log('Error in buildstoryboard() function. ', err.message);  }
}

/*getBackground() through getPostion() ... reads the page # and determines CSS for left/right layout*/
function getBackground(i){
if (i%2 == 1) { return "home_bg_right";}
else {   return "home_bg_left"; }
}

function getArticleBackground(i){
if (i%2 == 1) { return "other_bg_right";}
else {   return "other_bg_left"; }
}

function getHeadingBorder(i){
if (i%2 == 1) { return "heading_border_right";}
else {   return "heading_border_left"; }
}

function getContentDescription(i){
if (i%2 == 1) { return "content_description_right";}
else {   return "content_description_left"; }
}

function getHeading(i){
if (i%2 == 1) { return "heading_right";}
else {   return "heading_left"; }
}

function getPosition(i){
if (i%2 == 1) { return "right_container";}
else {   return "left_container"; }
}

/*If the asset is a .mp4 open it in the video modal, else just show the file link*/
function mp4Check(v_isVideo,url, name){

if (!v_isVideo || !v_isVideo.length){
return "<a href=\""+url+"\" target=\"_leader\" class=\"leadership_click\">";
}
else if(v_isVideo==='true'){
return "<a href=\"#\" class=\"morelink\" video-ref=\" \" video-src=\""+url+"\" video-title=\""+name+"\">";
}
else {
return "<a href=\""+url+"\" target=\"_leader\" class=\"leadership_click\">";
}

}

function linkVisible(linktext, link){

if (!linktext || !linktext.length){
 return "hider";
}
else if (!link || !link.length) {
return "hider";
}
else {
return " ";
}

}

/*If the asset is a .mp4 open it in the video modal, else just show the file*/
function mp4CheckWorkshop(v_isVideo, url, name){
if (!v_isVideo || !v_isVideo.length){
return  ' <a href="'+url+'" class="view_labs" workshop-name="'+name+'" target="_labs">';
}
else if(v_isVideo==='true'){
return "<a href=\"#\" class=\"morelink\" video-ref=\" \" video-src=\""+url+"\" video-title=\""+name+"\">";
}
else {
return  ' <a href="'+url+'" class="view_labs" workshop-name="'+name+'" target="_labs">';
}

}

/*Builds intro constructs the first page of the design with core logo and instructions.*/
function buildInstruction(i) {
log('Showing Instruction Page','Page number: '+ i);
return '<div class="'+getPosition(i)+' mob_page '+getBackground(i)+' ">'+
        '<div id="left_content">'+
        '<img src="img/logo2.png" class="logo" alt="logo"/>'+
        '<h1>Welcome to Cloud Accelerate</h1>'+
        '<p>Swipe or drag to view &amp; execute your presonalized Dev Ops Vision</p>'+
        '</div></div>';
}

/*Builds the intro page with the customer name.*/
function buildIntro(i,content) {
log('Showing Intro Page','Page number: '+ i);
return'<div class="'+getPosition(i)+' mob_page '+getBackground(i)+'" >'+
       '<div id="right_content">'+
       '<h1 class="title">'+content.customername+'</h1>'+
       '<span class="devops">'+content.subtitle+'</span>'+
       '</div>'+
       '</div>';
}

/*Builds the ideation title page.*/
function buildIdeation(i,content) {
log('Showing Ideation Page','Page number: '+ i);
return '<div class="'+getPosition(i)+' mob_page '+getArticleBackground(i)+'">'+
        '<div class="intro_day"><div class="'+getHeading(i)+'">'+content.pagetitle+'</div>'+
        '<div class="'+getHeadingBorder(i)+'"></div><div class="content_section" id="fulltext">'+
        '<div class="content_section_heading">'+
       '     <span>'+content.pagesubtitle+'</span>'+
       ' </div><div align="center" class="ideation_img">'+
       '      <img src="'+content.pageimage+'" alt="ideation"/>'+
       ' </div><div class="content_description">'+
       ' <div class="content_description_text">'+
       '           <p class="italic">'+content.date+'</p>'+
       '           <p class="">'+content.description+'</p><br/>'+
       '  </div><p align="" class="bold link textright">'+
       '    <a href="'+content.launchlink+'" target="_IVM" class="launch_ivm">'+
       '       <img src="img/icon_launch.png" class="launch_icon" alt="launch IVM" align="middle"/>'+content.launchlinktext+'</a>'+
       '</p></div></div></div></div>';
}

/*Build the enabler page*/
function buildEnabler(i,content) {
log('Showing Enabler Page','Page number: '+ i);
return '<div class="'+getPosition(i)+' mob_page '+getArticleBackground(i)+'" >'+
       '<div class="intro_day">'+
       '<div class="'+getHeading(i)+'">'+content.pagesubtitle+'</div>'+
       '<div class="'+getHeadingBorder(i)+'"></div>'+
       '<div class="content_section">'+
       '<div id="picture">'+
       '<img src="'+content.enablerimage+'" alt="Enabler image"/>'+
       '</div>'+
       '<div class="content_description">'+
       '<div class="content_description_text">'+
       '<p align="center" class="enabler_name">'+content.enablername+'</p>'+
       '<p>'+content.description+'</p>'+
        '</div>'+
        '<p align="" class="bold link textright">'+
       '<a href="mailto:'+content.emailaddress+'?subject=Cloud Accelerate Question" class="enabler_email">Contact &gt;</a>'+
       '</p> </div> </div> </div> </div>';
}

/*Build the Ideation Results Page*/
function buildIdeationResults(i,content) {
log('Showing Ideation Results Page','Page number: '+ i);
return '<div class="'+getPosition(i)+' mob_page '+getArticleBackground(i)+'">'+
       '<div class="intro_day"><div class="'+getHeading(i)+'">'+content.pagetitle+'</div>'+
       '<div class="'+getHeadingBorder(i)+'"></div>'+
       '<div class="content_section">'+
       '<div align="center" class="ideation_img">'+
       '     <img src="'+content.ideationimg+'" alt="idealation results"/>'+
       '</div>'+
      ' <div class="content_description_results"><div class="content_description_left no_mobile">'+
       '<p><img src="'+content.ideationimg_small+'" alt="cloud accelerate thumbnail"/></p></div>'+
       '<div class="content_description_right textcontainer">'+
      ' <div class="content_description_text">'+
      ' <p>'+content.date+'</p>'+
      ' <p>'+content.description+'</p></div><br/>'+
      ' <p align="" class="bold link"><a href="'+content.launchlink+'" class="ivm_rpt" target="_ivm_rpt">'+
      ' <img src="img/icon_launch.png" class="launch_icon" alt="view report" align="middle"/>'+content.launchlinktext+'</a>'+
      ' </p></div> </div> </div></div></div>';
}


function buildEnablingTechnologies(i,content) {
log('Showing Enabling Technologies Page','Page number: '+ i);
var num=i+1;
var holder= '<div class="'+getPosition(i)+' mob_page '+getArticleBackground(i)+'">'+
       '<div class="intro_day"><div class="'+getHeading(i)+'">'+content.pagetitle+'</div>'+
       '<div class="'+getHeadingBorder(i)+'"></div><div class="content_section">'+
       '<div class="content_description_technology">'+
       '<div class="content_description_technology_row" id="subpage21">'+
       '<div class="'+getContentDescription(i)+' textcontainer1">'+
       '<h1>'+content.technologytitle+'</h1>'+
       '<p>'+content.technologytext+'</p>'+
       '</div>'+
       '<div class="'+getContentDescription(num)+' no_mobile">'+
       '<img src="'+content.technologyimage+'" class="logo morelink" video-title="'+content.technologytitle+'" video-src="'+content.videolink+'" video-ref="'+content.videoreference+'"/>'+
       '</div><div class="watch bold link textright">'+
       '<a href="#" class="morelink" video-title="'+content.technologytitle+'" video-src="'+content.videolink+'" video-ref="'+content.videoreference+'">'+
       '<img src="img/icon_launch.png" class="launch_icon" alt="watch" align="middle"/>Watch</a>'+
       '</div></div>'; 
       
       if (!content.technologytitle2 || !content.technologytitle2.length){}
       else {
     var holder= holder+ '<div class="content_description_technology_row" id="subpage22">'+
      '<div class="'+getContentDescription(i)+' no_mobile">'+
      '<img src="'+content.technologyimage2+'" class="logo morelink" video-title="'+content.technologytitle2+'" video-src="'+content.videolink2+'" video-ref="'+content.videoreference2+'"/>'+
      '</div><div class="'+getContentDescription(num)+' textcontainer1">'+
      '<h1>'+content.technologytitle2+'</h1>'+
      '<p>'+content.technologytext2+'</p>'+
      '</div><div class="watch bold link textleft">'+
      '<a href="#" class="morelink" video-title="'+content.technologytitle2+'" video-src="'+content.videolink2+'" video-ref="'+content.videoreference2+'">'+
      '<img src="img/icon_launch.png" class="launch_icon" alt="watch" align="middle"/>Watch</a>'+
      '</div></div></div></div></div></div>';
       }
      return holder;
}

function buildEnablement(i,content) {
log('Showing Enablablement Page','Page number: '+ i);
return '<div class="'+getPosition(i)+' mob_page '+getArticleBackground(i)+'">'+
        '<div class="intro_day">'+
       ' <div class="'+getHeading(i)+'">'+content.pagetitle+'</div>'+
       ' <div class="'+getHeadingBorder(i)+'"></div>'+
       ' <div class="content_section">'+
       ' <div class="content_section_heading">'+
       ' <span>'+content.workshopname+'</span></div>'+
        '<div align="center" class="ideation_img">'+
       ' <img src="'+content.workshopimage+'" alt="ideation image"/>'+
       ' </div>'+
       ' <div class="content_description">'+
       ' <div class="content_description_text">'+
       ' <p>Estimated Time: '+content.workshoplength+'</p>'+
       ' <p class="enable_text">'+content.description+'</p>'+'<a href="#" class="moretextlink" page-num="'+i+'">+<i> Read More</i></a>'+
       ' </div><br/><p align="" class="bold link">'+mp4CheckWorkshop(content.isVideo, content.launchlink, content.workshopname)+
       ' <img align="middle" src="img/icon_launch.png" class="launch_icon" alt="View Lab Guides "/>'+content.launchlinktext+'</a>'+
        '</p></div></div></div></div>';
}

function buildLeadership(i,content) {
log('Showing Leadership Page','Page number: '+ i);
return '<div class="'+getPosition(i)+' mob_page '+getArticleBackground(i)+'">'+
       '<div class="intro_day">'+
       '<div class="'+getHeading(i)+'">'+content.pagetitle+'</div>'+
       '<div class="'+getHeadingBorder(i)+'"></div>'+
       '<div class="content_section">'+
       '<div align="center" class="leadership_img">'+
       '<img src="'+content.leaderimage+'" alt="Leadership Image"/>'+
       '</div><div class="content_description clear">'+
       '<div class="content_description_text">'+
       '<p class="enable_text">'+content.leadertext+'</p>'+
       '<a class="leadertextlaunch" page-num="'+i+'" href="#">+<i> Read More</i></a>'+
       '</div><br/>'+
       '<p class="bold link textleft '+linkVisible(content.leaderlinktext,content.leaderlink)+'">'+
       mp4Check(content.isVideo,content.leaderlink, content.leaderlinktext)+
       '<img src="img/icon_launch.png" class="launch_icon" alt="View Presentation" align="middle"/>'+content.leaderlinktext+'</a>'+
       '</p></div></div></div></div>';
}

function buildQuotes(i,content) {
log('Showing Quotes Page','Page number: '+ i);
var holder ='<div class="'+getPosition(i)+' mob_page '+getArticleBackground(i)+'">'+
            '<div class="intro_day">'+
            '<div class="content_section">'+
            '<div class=" leadership">';
            $.each(content.quotes, function(index, output) {
              holder = holder + '<p><b>&quot;'+output.quote+'&quot;</b><br/><span class="floatright">'+output.name+'</span></p>';
            });
 holder = holder + '</div></div></div></div>';
return holder;
}

function buildBlank(i) {
log('Showing Blank Page','Page number: '+ i);
return '<div class="'+getPosition(i)+' mob_page '+getArticleBackground(i)+'"></div>';
}


function moveforward() {
//remove the current page data
$(".section").empty();
$(".section").hide();
var i=0;

if(isMobile) {
current_page++;
buildpage(current_page);
}
else {
    //build 2 pages if not in mobile mode
    while (i<2) {
        if (current_page < (pages-1)) {
            current_page++;
            buildpage(current_page);
        }
        else{
       // console.log('Build blank end page.');
        $(".section").append(buildBlank(1));
        }
        i++;
    }
}
//show back button once off title page
if(current_page>=2){
   $(".backbutton").show();
   $(".intro_bg").hide();
}

//hide next button if on the last page
if (current_page>=(pages-1)) {
$(".nextbutton").hide();
}

//console.log("Current Page Set To: "+ current_page);
}

function moveback() {
//remove the current page data
$(".section").empty();
$(".section").hide();

if(isMobile) {
    current_page--;
    buildpage(current_page);
    //show back button once off title page
    if(current_page==0){
       $(".backbutton").hide();
       $(".intro_bg").show();
    }
}

else {
//if on last page if odd number of total pages do this
if (current_page==(pages-1) && (pages%2)==1) {
//console.log("Showing last page");
buildpage(current_page-1);
buildpage(current_page-2);
current_page=current_page-1;
}
//if on page before the end.
else {
buildpage(current_page-2);
buildpage(current_page-3);
current_page=current_page-2;
}
//show back button once off title page
if(current_page<2){
   $(".backbutton").hide();
   $(".intro_bg").show();
}
}

//hide next button if on the last page
if (current_page<(pages-1)) {
$(".nextbutton").show();
}
}

//log IVM launch opening
$(document.body).on('click', '.launch_ivm' , function(e) {
log('IVM Launched from Landing Pad',' ');
});


//Next Button Click
$(document.body).on('click', '.nextbutton' , function(e) {
log('Next Button Clicked','');
moveforward();
});

//back button click
$(document.body).on('click', '.backbutton' , function(e) {
log('Next Button Clicked','');
moveback();
});

/*Code to close the text popup*/
$(document.body).on('click', '.launchpreviousleadership' , function() {
     log('Leadership Presentation Previous Button Clicked','');
     buildtextmodalleadership($(this).attr('page-num'));
});

/*Code to close the text popup*/
$(document.body).on('click', '.launchnextleadership' , function() {
     log('Leadership Presentation Next Button Clicked','');
     buildtextmodalleadership($(this).attr('page-num'));
});

/*Key Press Actions*/
document.addEventListener("keyup", function(e) {
        //if right arrow pressed
        if (e.keyCode == 39) {
           if (current_page<(pages-1)) {
            log('Right Arrow Pressed','');
            moveforward();
           }
        }
        
        //if left arrow pressed
        if (e.keyCode == 37) {
          if (current_page>1) {
            log('Left Arrow Pressed','');
            moveback();
          }
        }
        
        //letter i pressed
        if (e.keyCode == 73) {
           if ($('.launch_ivm').is(":visible")) {
            log('Hiding internal IVM Link','');
            $('.launch_ivm').hide();
           }
           else{
           log('Show internal IVM Link','');
            $('.launch_ivm').show();
           }
        }
        
}, false);

/*Swipe Commands for mobile*/
$(document).on( "swipeleft", ".ui-page", function( event ) {
log('Left Swipe Action','');
                if (current_page<(pages-1)) {
                    moveforward();
                 }
});

$(document).on( "swiperight", ".ui-page", function( event ) {
log('right Swipe Action','');
        if (current_page>1) {
            log('Left Arrow Pressed','');
            moveback();
        }            
});

//log Enabler email launch opening
$(document.body).on('click', '.enabler_email' , function(e) {
log('Enabler Email Contact Button Pressed','Enabler: '+$(this).attr('href'));
});

//log Enabler email launch opening
$(document.body).on('click', '.ivm_rpt' , function(e) {
log('IVM Report PDF Opened',' ');
});

//log Enabler email launch opening
$(document.body).on('click', '.view_labs' , function(e) {
log('Lab Guide Viewed',$(this).attr('workshop-name'));
});

//log Enabler email launch opening
$(document.body).on('click', '.leadership_click' , function(e) {
log('Leadership Presentation Downloaded',$(this).attr('href'));
});

/*Open Model to show more text*/
$(document.body).on('click', '.moretextlink' , function(e) {
log('Opening more Text Modal','');
buildtextmodal($(this).attr('page-num'));
 $(".section").hide();
 $(".modal-text").show();
 e.preventDefault();
});

/*Open Model to leadership presentation*/
$(document.body).on('click', '.leadertextlaunch' , function(e) {
 log('Opening more Text Modal for leadership','');
 buildtextmodalleadership($(this).attr('page-num'));
 $(".section").hide();
 $(".modal-leadership").show();
 e.preventDefault();
});

/*Code to close the text popup*/
$(document.body).on('click', '.launchclosetext' , function() {
     log('Closing Text Modal','');
     $(".modal-text").hide();
      $(".section").show();
});

/*Code to close the text popup*/
$(document.body).on('click', '.launchcloseleadership' , function() {
     log('Closing leadership Modal','');
     $(".modal-leadership").hide();
     $(".section").show();
});

function buildtextmodal(i){
$(".text_title").empty();
$(".text_detail").empty();
$(".text_image").empty();
$(".text_title").text(holder.pages[i].workshopname);
$(".text_detail").text(holder.pages[i].description);
$(".text_image").attr("src", holder.pages[i].workshopimage);
}

function buildtextmodalleadership(i){
log("Showing Present Mode Leadership Frame: ", i);
$(".leader_text_detail").empty();
$(".leader_image").empty();
$(".leader_text_detail").append(holder.pages[i].leadertext);
$(".leader_img").attr("src", holder.pages[i].leaderimage);

try{
//if the priorpage was a leadership page show the previous button.
var before = i;
before--;

var after = i;
after++;

if(holder.pages[before].pagedesign.toLowerCase() === "leadership") { 
$(".launchpreviousleadership").show();
$(".launchpreviousleadership").attr("page-num",before);
}
else {$(".launchpreviousleadership").hide();}

if(holder.pages[after].pagedesign.toLowerCase() === "leadership") { 
$(".launchnextleadership").show();
$(".launchnextleadership").attr("page-num",after);
}
else{ $(".launchnextleadership").hide(); }


}
catch(err){
            log('Error in buildtextmodalleadership() next/previous button display.',err.message);
}

}

/*On Click show the video*/
 var _video = document.getElementById("playvideo");
 var src='empty'; 
 var isVideoShowing =false;

/*Code to Dynamically play video*/
$(document.body).on('click', '.morelink' , function(e) {
src = $(this).attr('video-src');
log('Watch Enabling Technology Button Pressed','Watching Video: '+ $(this).attr('video-title') +'  Video Source: '+$(this).attr('video-src'));

//Reset Text in popup
$(".video_title").text($(this).attr('video-title'));
$(".video_url").text($(this).attr('video-ref'));
$(".video_url").attr("href", $(this).attr('video-src'));

//swap the video source and reset DOM
$('#playvideo').html('<source src="'+src+'" type="video/mp4"/>' +
'<p><br><br>' +'Your browser does not support the HTML 5 video. ' +
'<a href="'+src+'"> ' +'Try downloading the video instead from here.<\/a><\/p>');
$('#playvideo').load();
$('#playvideo').show();
_video.play();
isVideoShowing =true;
 $(".section").hide();
 $(".modal").show();
 e.preventDefault();
});




/*When enabling video ends log/reset to 1 sec*/
_video.addEventListener('ended', function () {
log("Enabling Technologies Video Ended","Video Timecode: "+_video.currentTime);
_video.pause();
log("Video Ended", src);
_video.currentTime = 1;
}, false);


/*Code to close the video popup*/
$(document.body).on('click', '.launchclose' , function() {
     _video.pause();
     log("Enabling Technologies Video Closed","Video Timecode: "+_video.currentTime);
     $(".modal").hide();
      $(".section").show();
     isVideoShowing =false;
} );

/*Function to preload images inside future pages in the application.*/
function preload(){
       try{
            $.each(holder.pages, function(index, page) {
                if (page.pagedesign.toLowerCase() === "ideation") { appendPreload(page.pageimage);  }
                else  if (page.pagedesign.toLowerCase() === "enabler") { appendPreload(page.enablerimage);  }
                else  if (page.pagedesign.toLowerCase() === "ideation results") {
                  appendPreload(page.ideationimg);
                  appendPreload(page.ideationimg_small);
                }                
               else  if (page.pagedesign.toLowerCase() === "enabling technologies") {
                   appendPreload(page.technologyimage);
                   appendPreload(page.technologyimage2);
                }               
               else  if (page.pagedesign.toLowerCase() === "enablement") {
                   appendPreload(page.workshopimage);
                } 
                
               else  if (page.pagedesign.toLowerCase() === "leadership") {
                     appendPreload(page.leaderimage);
                }            
                else {    }
             });
        }
        catch(err){
            log('Error preloading background images in preload().',err.message);
        }
             
}

function appendPreload(i){ $("#hidden_preload").append('<img src="'+i+'">'); }

//Test to see if we can log page load time wait 10 seconds then log
setTimeout(function(){log('Page Load Time is: ',millisecondsLoading);},10000);

if (screen.width<767) {
    isMobile=true;
    log('Application in Mobile Display Mode','');
}

//Capture browser dimensions
log('Browser Dimensions: ', '  Width: '+$(window).width()+ '  Height: '+$(window).height());
});

